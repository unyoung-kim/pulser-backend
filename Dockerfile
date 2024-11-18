# Use a base image with Puppeteer dependencies pre-installed
FROM node:18-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps && npx puppeteer install

# Build the project
RUN npm run build

# Expose the port (change 3000 if needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "./dist/src/index.js"]
