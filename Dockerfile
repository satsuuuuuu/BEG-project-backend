# 1. Upgrade to a modern Node version
FROM node:22-bookworm-slim

# 2. Install required system dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \ 
    wget \
    gnupg \
    unzip \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# 3. Skip Chromium download to save time (unless you absolutely need it)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Now run install
RUN npm install

# Copy the rest of your app
COPY . .

# Expose your port and start the app
EXPOSE 5000
CMD ["npm", "start"]