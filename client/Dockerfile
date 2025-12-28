# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files (except .dockerignore)
COPY . .

# Expose port (if your app uses one, e.g., 9000)
EXPOSE 5000

# Run app
CMD ["npm", "run", "dev"]
