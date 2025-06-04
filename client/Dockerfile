# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files except those in .dockerignore
COPY . .

# Explicitly copy .env.local (since it's .gitignored and possibly .dockerignored)
COPY .env.local .env.local

# Build Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app .

# Expose port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]
