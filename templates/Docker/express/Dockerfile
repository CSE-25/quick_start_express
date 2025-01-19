# An official Node.js runtime (Alpine version) as a parent image
FROM node:20-alpine

# Set the working directory inside the container - Customizable.
WORKDIR /app

# Copy package.json to the working directory.
COPY package.json ./

# Install dependencies, including nodemon for development.
RUN npm install

# Copy the application code to the container.
COPY . .

# TODO: Get the Port to be Exposed from .env => Can be Done after .env.local template is Ready.
# Expose the port the app runs on - Customizable.
EXPOSE 8080

# Command to start the application - Customizable.
ENTRYPOINT ["npm", "start"]