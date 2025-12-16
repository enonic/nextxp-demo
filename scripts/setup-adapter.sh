#!/bin/bash
# Setup script for installing the nextjs-adapter from local tarball
# This is needed because npm doesn't properly handle nested file: dependencies

set -e

echo "Setting up @enonic/nextjs-adapter..."

# Create node_modules structure if it doesn't exist
mkdir -p node_modules/@enonic/nextjs-adapter

# Extract the adapter tarball
echo "Extracting adapter tarball..."
tar -xzf .deps/enonic-nextjs-adapter-0.0.0.tgz -C node_modules/@enonic/nextjs-adapter --strip-components=1

echo "Adapter extracted successfully!"
echo "Now running npm install..."

# Run npm install
npm install

echo "Setup complete!"
