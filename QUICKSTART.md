# Quick Start - DevOps Infrastructure

## 5-Minute Quick Start

### 1. Test Locally with Docker

```bash
# Build image
docker build -t calyte:latest .

# Run with compose
docker-compose up -d

# Test
curl http://localhost:5000

# Cleanup
docker-compose down
```

### 2. Prepare for EKS (One-time Setup)

```bash
# Install tools
# macOS: brew install terraform kubectl aws-cli
# Ubuntu: sudo apt-get install terraform kubectl awscli

# Configure AWS
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1)
```

### 3. Deploy to EKS

```bash
# 3a. Create infrastructure
cd terraform
terraform init
terraform plan
terraform apply

# 3b. Update kubeconfig
aws eks update-kubeconfig --name calyte-cluster --region us-east-1

# 3c. Deploy app
cd ..
kubectl apply -f kubernetes/

# 3d. Get your app URL
kubectl get service calyte-service -n default
```

---

## File Structure

```
.
├── Dockerfile                          # Container image
├── docker-compose.yml                  # Local development
├── .dockerignore                       # Optimize builds
│
├── kubernetes/                         # Kubernetes manifests
│   ├── deployment.yaml                # App deployment (3 replicas)
│   ├── service.yaml                   # LoadBalancer service
│   ├── configmap.yaml                 # Configuration
│   ├── secret.yaml                    # Secrets (update with real values!)
│   ├── hpa.yaml                       # Auto-scaling (3-10 pods)
│   └── ingress.yaml                   # Domain routing
│
├── terraform/                         # Infrastructure-as-Code
│   ├── main.tf                        # VPC, EKS cluster, node groups
│   ├── variables.tf                   # Configuration variables
│   └── outputs.tf                     # Output values
│
├── .github/workflows/                 # CI/CD pipelines
│   ├── docker-build-push.yml         # Build & push images
│   └── deploy-eks.yml                 # Deploy to EKS
│
├── DEVOPS_SETUP_GUIDE.md             # Detailed setup guide
└── QUICKSTART.md                      # This file
```

---

## Key Configuration Updates

### 1. Update Docker Registry (Before Pushing)

Edit `.github/workflows/docker-build-push.yml`:
```yaml
tags: |
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/calyte:latest
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/calyte:${{ github.sha }}
```

### 2. Update Secret Values

Edit `kubernetes/secret.yaml`:
```yaml
stringData:
  mongodb-uri: "your-actual-mongodb-uri"
```

### 3. Update Ingress Domain

Edit `kubernetes/ingress.yaml`:
```yaml
- host: yourdomain.com
```

---

## GitHub Actions Secrets (For CI/CD)

Add to GitHub repository:
1. `AWS_ACCESS_KEY_ID`
2. `AWS_SECRET_ACCESS_KEY`
3. `REGISTRY_URL` (ECR URL)
4. `REGISTRY_USERNAME` (AWS)
5. `REGISTRY_PASSWORD` (from `aws ecr get-login-password`)

---

## Common Tasks

### View Logs
```bash
kubectl logs -f deployment/calyte-app -n default
```

### Scale Pods
```bash
kubectl scale deployment calyte-app --replicas=5
```

### Update Image
```bash
# Push new image to ECR, then:
kubectl set image deployment/calyte-app calyte=ECR_URL:new-tag
```

### Check Status
```bash
kubectl get pods -n default
kubectl get service -n default
kubectl top nodes
```

### Destroy Everything
```bash
kubectl delete -f kubernetes/
cd terraform && terraform destroy
```

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│         Your Domain                 │
│     (Route53 + Certificate)         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        ALB (Ingress)                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    EKS Cluster (Kubernetes)         │
│  ┌────────┬────────┬────────┐       │
│  │  Pod   │  Pod   │  Pod   │       │
│  │ App-1  │ App-2  │ App-3  │       │
│  └────────┴────────┴────────┘       │
│  HPA: Scale 3-10 based on metrics   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     MongoDB (AWS DocumentDB)        │
└─────────────────────────────────────┘
```

---

## Monitoring & Logs

### CloudWatch
```bash
# View container logs
kubectl logs POD_NAME -n default

# Monitor resources
kubectl top pods
kubectl top nodes

# Watch deployment
kubectl get deployment -w
```

### EKS Console
- AWS Console → EKS → Clusters → calyte-cluster
- View metrics, logs, resources, and health

---

## Cost Estimate (Approximate)

- **EKS Cluster**: $73.50/month
- **3x t3.medium Nodes**: ~$60/month each = $180/month
- **Load Balancer**: ~$16/month
- **NAT Gateway**: ~$32/month
- **MongoDB Atlas (optional)**: $57-$1500+/month

**Total**: ~$350-600/month (excluding data transfer)

---

## Next Steps

1. ✅ Test with Docker locally
2. ✅ Setup AWS account and credentials
3. ✅ Deploy infrastructure with Terraform
4. ✅ Deploy application to EKS
5. 🔜 Configure domain and SSL
6. 🔜 Setup monitoring and alerts
7. 🔜 Configure backups and disaster recovery

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods not starting | `kubectl describe pod POD_NAME` |
| Image pull errors | Verify ECR credentials and image exists |
| Service not accessible | Check ingress and security groups |
| High latency | Review HPA metrics and node capacity |
| Connection timeouts | Check network policies and security groups |

---

## Support

- Full guide: `DEVOPS_SETUP_GUIDE.md`
- Kubernetes docs: https://kubernetes.io/docs/
- AWS EKS docs: https://docs.aws.amazon.com/eks/
- Terraform docs: https://registry.terraform.io/providers/hashicorp/aws/

---

**Ready? Start with:** `docker-compose up -d`
