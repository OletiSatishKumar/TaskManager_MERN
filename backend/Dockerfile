# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the server code
COPY . .

# Expose the backend port (change if needed)
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
