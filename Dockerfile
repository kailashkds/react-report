# Use an official Node.js runtime as the base image
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

RUN npm install bootstrap

# Copy the entire project to the container
COPY . .

# Set the environment variable
ENV REACT_APP_BACKEND_URL='http://localhost:80'

# Build the React app
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
