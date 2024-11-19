#!/usr/bin/env bash
# Exit on error
set -o errexit

# Clean up (optional, only if required by your project)
npm run cleanse

# Install dependencies with legacy peer dependency handling
npm install --legacy-peer-deps

# Build the project (if necessary)
npm run build

# Manage Puppeteer cache
if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then 
    echo "...Copying Puppeteer Cache from Build Cache" 
    cp -R $XDG_CACHE_HOME/puppeteer/ $PUPPETEER_CACHE_DIR
else 
    echo "...Storing Puppeteer Cache in Build Cache" 
    cp -R $PUPPETEER_CACHE_DIR $XDG_CACHE_HOME
fi