# Use Node.js official image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app/

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install ts-node globally
RUN npm install -g ts-node typescript

# Expose the default port for the application
EXPOSE 3000

# Start the application using ts-node
CMD ["npm", "start"]