
# Use a lightweight Node.js LTS image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set production environment
ENV NODE_ENV=production

# Document the port used by the application
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]
