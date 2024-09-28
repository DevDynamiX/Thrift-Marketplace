# Use Node.js official image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app/

# Log the working directory
RUN echo "Working directory set to /usr/src/app"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
RUN echo "Copied package.json and package-lock.json"


# Install dependencies
RUN npm install && echo "Installed dependencies"

# Copy the rest of the application code
COPY . .

# Expose the default Expo port
EXPOSE 3000
RUN echo "Exposing port 3000"

# Start the Expo server
CMD ["npm", "start"]