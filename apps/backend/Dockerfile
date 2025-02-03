# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:prod"]
