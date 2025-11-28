# DevOps Infrastructure Setup Guide for Calyte

This guide will walk you through containerizing your Calyte application and deploying it to AWS EKS (Elastic Kubernetes Service).

## Table of Contents
1. [Local Setup with Docker](#local-setup)
2. [Container Registry Setup](#registry-setup)
3. [AWS EKS Deployment](#eks-deployment)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Monitoring & Logging](#monitoring)

---

## 1. Local Setup with Docker {#local-setup}

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Node.js 20+ (if running locally without Docker)

### Step 1.1: Build Docker Image Locally

```bash
# Build the image
docker build -t calyte:latest .

# Test the image
docker run -p 5000:5000 calyte:latest
```

### Step 1.2: Run with Docker Compose

```bash
# Start all services (app + MongoDB)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Step 1.3: Verify Local Deployment

```bash
# Check if app is running
curl http://localhost:5000

# Check MongoDB connection
docker-compose exec app npm run test:db

# View running containers
docker-compose ps
```

---

## 2. Container Registry Setup {#registry-setup}

### Step 2.1: Choose a Registry

Options:
- **AWS ECR** (Recommended for EKS)
- Docker Hub
- Private registry (Harbor, Nexus)

### Step 2.2: Setup AWS ECR

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name calyte \
  --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag your image
docker tag calyte:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/calyte:latest

# Push to ECR
docker push \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/calyte:latest
```

---

## 3. AWS EKS Deployment {#eks-deployment}

### Step 3.1: Prerequisites

```bash
# Install required tools
# macOS
brew install terraform kubectl aws-cli

# Ubuntu/Debian
sudo apt-get install terraform kubectl awscli

# Verify installations
terraform version
kubectl version --client
aws --version
```

### Step 3.2: Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: us-east-1
# Enter default output: json
```

### Step 3.3: Deploy Infrastructure with Terraform

```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
# Review and type 'yes' to confirm

# Save the outputs
terraform output > ../eks-outputs.txt
```

### Step 3.4: Update Kubeconfig

```bash
# Update kubeconfig to connect to EKS
aws eks update-kubeconfig \
  --name calyte-cluster \
  --region us-east-1

# Verify connection
kubectl cluster-info
kubectl get nodes
```

### Step 3.5: Create Kubernetes Secrets

```bash
# Create namespace (optional)
kubectl create namespace calyte

# Create MongoDB connection secret
kubectl create secret generic calyte-secrets \
  --from-literal=mongodb-uri='mongodb+srv://user:password@cluster.mongodb.net/calyte?retryWrites=true&w=majority' \
  -n default

# Verify secret
kubectl get secrets -n default
```

### Step 3.6: Deploy Application

```bash
# Update image in deployment.yaml with your ECR URL
# Edit kubernetes/deployment.yaml and replace:
# image: your-registry/calyte:latest
# with your actual ECR image URL

# Apply all Kubernetes manifests
kubectl apply -f kubernetes/

# Verify deployment
kubectl get deployments -n default
kubectl get pods -n default

# Check service
kubectl get service calyte-service -n default

# Watch rollout status
kubectl rollout status deployment/calyte-app -n default
```

### Step 3.7: Access Your Application

```bash
# Get the LoadBalancer URL
kubectl get service calyte-service -n default -o wide

# The external IP is your application URL
# Access via: http://EXTERNAL-IP
```

---

## 4. CI/CD Pipeline {#cicd-pipeline}

### Step 4.1: Setup GitHub Actions

```bash
# Create GitHub secrets in your repository settings
# Go to: Settings > Secrets and variables > Actions > New repository secret

# Add these secrets:
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - REGISTRY_URL (your ECR repository URL)
# - REGISTRY_USERNAME (AWS for ECR)
# - REGISTRY_PASSWORD (from aws ecr get-login-password)
```

### Step 4.2: Workflow Files Already Included

```
.github/workflows/
├── docker-build-push.yml   # Builds and pushes Docker image
└── deploy-eks.yml          # Deploys to EKS
```

### Step 4.3: Trigger Pipeline

```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Trigger deployment"
git push origin main

# Monitor pipeline progress on GitHub
# Go to: Actions tab in your GitHub repository
```

---

## 5. Monitoring & Logging {#monitoring}

### Step 5.1: View Logs

```bash
# View application logs
kubectl logs deployment/calyte-app -n default

# Follow logs in real-time
kubectl logs -f deployment/calyte-app -n default --all-containers=true

# View logs from specific pod
kubectl logs POD_NAME -n default

# View pod events
kubectl describe pod POD_NAME -n default
```

### Step 5.2: Monitor Resources

```bash
# Get pod metrics
kubectl top pods -n default

# Get node metrics
kubectl top nodes

# Watch deployment status
kubectl get deployment calyte-app -n default -w
```

### Step 5.3: Setup CloudWatch Logging

```bash
# Install EKS CloudWatch logging
# Edit kubernetes/deployment.yaml to add logging configuration

# Or use CloudWatch Container Insights
aws eks update-cluster-config \
  --name calyte-cluster \
  --logging '{"clusterLogging":[{"types":["api","audit","authenticator","controllerManager","scheduler"],"enabled":true,"logGroupName":"/aws/eks/calyte-cluster/cluster"}]}' \
  --region us-east-1
```

---

## Common Commands Reference

```bash
# Cluster Management
kubectl get nodes
kubectl describe node NODE_NAME
kubectl drain NODE_NAME

# Deployment Management
kubectl apply -f kubernetes/
kubectl delete deployment calyte-app
kubectl scale deployment calyte-app --replicas=5
kubectl set image deployment/calyte-app calyte=NEW_IMAGE

# Pod Management
kubectl exec -it POD_NAME -- /bin/sh
kubectl port-forward pod/POD_NAME 5000:5000
kubectl delete pod POD_NAME

# Service Management
kubectl expose deployment calyte-app --type=LoadBalancer --port=80 --target-port=5000
kubectl get service
kubectl delete service calyte-service

# Configuration Management
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl edit configmap calyte-config
```

---

## Cleanup & Destroy

### Warning: This will delete all resources

```bash
# Delete Kubernetes resources
kubectl delete -f kubernetes/

# Destroy AWS infrastructure
cd terraform
terraform destroy
# Type 'yes' to confirm
```

---

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod POD_NAME -n default
kubectl logs POD_NAME -n default
```

### Image pull errors
```bash
# Verify ECR credentials
aws ecr describe-repositories --region us-east-1

# Check image exists
aws ecr describe-images --repository-name calyte --region us-east-1
```

### Connection issues
```bash
# Verify kubeconfig
kubectl config view

# Test cluster connection
kubectl cluster-info
```

---

## Next Steps

1. Configure custom domain with Route53
2. Setup SSL/TLS with AWS Certificate Manager
3. Setup CloudFront CDN
4. Configure backup and disaster recovery
5. Setup performance monitoring and alerts

---

## Support & Resources

- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest)
