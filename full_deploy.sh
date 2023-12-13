#!/bin/bash

set -e

NAMESPACE="rpll-namespace"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install Minikube if not installed
if ! command_exists minikube; then
  echo "Installing Minikube..."
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  chmod +x minikube
  sudo mv minikube /usr/local/bin/
fi

# Start Minikube
echo "Starting Minikube..."
minikube start --force

# Set kubectl context to minikube
kubectl config use-context minikube

# Check for required tools
if ! command_exists kompose; then
  echo "kompose is not installed. Installing..."
  curl -L https://github.com/kubernetes/kompose/releases/download/v1.22.0/kompose-linux-amd64 -o kompose
  chmod +x kompose
  sudo mv kompose /usr/local/bin/
fi

# Convert Docker-Compose to Kubernetes Manifests
echo "Converting docker-compose.yml to Kubernetes manifests..."
kompose convert -f docker-compose.yml

# Create a Namespace
echo "Creating namespace: $NAMESPACE..."
kubectl create namespace $NAMESPACE || echo "Namespace $NAMESPACE already exists."

# Deploy to Kubernetes
echo "Deploying to Kubernetes..."
kubectl apply -f . -n $NAMESPACE

# Verify Deployment
echo "Verifying deployments..."
kubectl get deployments -n $NAMESPACE
echo "Verifying services..."
kubectl get svc -n $NAMESPACE

# Handle Persistent Storage
PVC_STATUS=$(kubectl get pvc -n $NAMESPACE -o=jsonpath='{.items[*].status.phase}')
if [[ $PVC_STATUS != "Bound" ]]; then
  echo "Warning: Some PersistentVolumeClaims are not bound. Please ensure storage is provisioned."
fi

# Adjust Configurations
REVERSE_PROXY_SERVICE=$(kubectl get svc reverse-proxy -n $NAMESPACE -o=jsonpath='{.spec.ports[?(@.port==1234)].targetPort}')
if [[ $REVERSE_PROXY_SERVICE != "80" ]]; then
  echo "Warning: reverse-proxy service port mapping might be incorrect. Please check."
fi

echo "Deployment completed! Please review the resources and configurations in the $NAMESPACE namespace."
