# Use a lightweight Node image
FROM node:18-slim

# Install necessary Chrome dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    chromium \
    fonts-liberation \
    libgbm-dev \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Start the application
CMD ["node", "server.js"]