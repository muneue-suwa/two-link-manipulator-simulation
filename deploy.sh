#!/usr/bin/bash

# Deploy script for GitHub Actions

# Create public directory
PUBLIC_DIRNAME=public
mkdir -p $PUBLIC_DIRNAME

# Copy HTML & JavaScript files
cp index.html $PUBLIC_DIRNAME
cp favicon.ico $PUBLIC_DIRNAME
cp -r js $PUBLIC_DIRNAME
