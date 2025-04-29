# Step 1: Build the React client
FROM node:18 AS client-build
WORKDIR /app
COPY client ./client
RUN cd client && npm install && npm run build

# Step 2: Build the backend and serve frontend
FROM node:18
WORKDIR /app

# Copy backend
COPY backend ./backend

# Copy built frontend into backend public folder (adjust if needed)
COPY --from=client-build /app/client/build ./backend/public

# Install backend dependencies
RUN cd backend && npm install

# Expose backend port
EXPOSE 8000

# Run the backend server
CMD ["node", "backend/server.js"]
