# Use Node.js LTS slim image
FROM node:20-slim

# Install OpenSSL required by Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package dependency manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port (Cloud Run sets the PORT env variable automatically)
EXPOSE 8080

# Start server
CMD ["node", "src/server.js"]
