terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }

  backend "s3" {
    bucket         = "calyte-terraform-state"
    key            = "eks/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "kubernetes" {
  host                   = aws_eks_cluster.calyte.endpoint
  cluster_ca_certificate = base64decode(aws_eks_cluster.calyte.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.calyte.token
}

# VPC
resource "aws_vpc" "calyte" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "calyte-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "calyte_public" {
  count                   = 2
  vpc_id                  = aws_vpc.calyte.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "calyte-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
resource "aws_subnet" "calyte_private" {
  count             = 2
  vpc_id            = aws_vpc.calyte.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 2)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "calyte-private-subnet-${count.index + 1}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "calyte" {
  vpc_id = aws_vpc.calyte.id

  tags = {
    Name = "calyte-igw"
  }
}

# Elastic IP
resource "aws_eip" "calyte" {
  count  = 2
  domain = "vpc"

  tags = {
    Name = "calyte-eip-${count.index + 1}"
  }
}

# NAT Gateway
resource "aws_nat_gateway" "calyte" {
  count         = 2
  allocation_id = aws_eip.calyte[count.index].id
  subnet_id     = aws_subnet.calyte_public[count.index].id

  tags = {
    Name = "calyte-nat-${count.index + 1}"
  }
}

# Route Tables
resource "aws_route_table" "calyte_public" {
  vpc_id = aws_vpc.calyte.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.calyte.id
  }

  tags = {
    Name = "calyte-public-rt"
  }
}

resource "aws_route_table" "calyte_private" {
  count  = 2
  vpc_id = aws_vpc.calyte.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.calyte[count.index].id
  }

  tags = {
    Name = "calyte-private-rt-${count.index + 1}"
  }
}

# Route Table Associations
resource "aws_route_table_association" "calyte_public" {
  count          = 2
  subnet_id      = aws_subnet.calyte_public[count.index].id
  route_table_id = aws_route_table.calyte_public.id
}

resource "aws_route_table_association" "calyte_private" {
  count          = 2
  subnet_id      = aws_subnet.calyte_private[count.index].id
  route_table_id = aws_route_table.calyte_private[count.index].id
}

# EKS Cluster Role
resource "aws_iam_role" "eks_cluster_role" {
  name = "calyte-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# EKS Cluster
resource "aws_eks_cluster" "calyte" {
  name     = "calyte-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = concat(aws_subnet.calyte_public[*].id, aws_subnet.calyte_private[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]

  tags = {
    Name = "calyte-cluster"
  }
}

# EKS Node Group Role
resource "aws_iam_role" "eks_node_group_role" {
  name = "calyte-eks-node-group-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node_group_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node_group_role.name
}

resource "aws_iam_role_policy_attachment" "eks_registry_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node_group_role.name
}

# EKS Node Group
resource "aws_eks_node_group" "calyte" {
  cluster_name    = aws_eks_cluster.calyte.name
  node_group_name = "calyte-node-group"
  node_role_arn   = aws_iam_role.eks_node_group_role.arn
  subnet_ids      = aws_subnet.calyte_private[*].id

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 3
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_registry_policy,
  ]

  tags = {
    Name = "calyte-node-group"
  }
}

# Data source for EKS cluster auth
data "aws_eks_cluster_auth" "calyte" {
  name = aws_eks_cluster.calyte.name
}

# Data source for availability zones
data "aws_availability_zones" "available" {
  state = "available"
}
