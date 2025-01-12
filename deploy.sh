#!/bin/bash

# Exit on error
set -e

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
fi

# Set up git configuration
git config --local user.email "github-actions[bot]@users.noreply.github.com"
git config --local user.name "GitHub Actions Bot"

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Stage all files
git add .

# Commit changes if there are any
git diff --staged --quiet || git commit -m "Initial commit"

# Create repository only if it doesn't exist
REPO_NAME="sobol-ai-platform"
REPO_CHECK=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME")

if [ "$REPO_CHECK" == "404" ]; then
    curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/user/repos \
         -d "{\"name\":\"$REPO_NAME\",\"private\":false}"
fi

# Remove existing remote if it exists
git remote remove origin 2>/dev/null || true

# Add remote and push
git remote add origin "https://x-access-token:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git branch -M main
git push -f origin main

echo "Repository deployed successfully to GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"