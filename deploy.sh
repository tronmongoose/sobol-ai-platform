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

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Create repository and push
REPO_NAME="sobol-ai-platform"
curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos \
     -d "{\"name\":\"$REPO_NAME\",\"private\":false}"

# Add remote and push
git remote add origin "https://x-access-token:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git branch -M main
git push -u origin main

echo "Repository deployed successfully to GitHub!"
