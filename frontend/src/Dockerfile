# Use Node.js official image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app/Thrift-Marketplace

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm update -g expo-cli
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default Expo port
EXPOSE 19000

# Start the Expo server
CMD ["npm", "start"]