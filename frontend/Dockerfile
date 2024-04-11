# Use the node image from official Docker Hub
FROM node:16.10.0-alpine3.13 as build-stage
# Set the working directory
WORKDIR /app
# Copy the working directory in the container
COPY package*.json ./
# Install the project dependencies
RUN npm install
# Copy the rest of the project files to the container
COPY . .
# Build the Vue.js application to the production mode to dist folder
RUN npm run build
# New stage: Use a node image to serve the built app using 'serve'
FROM node:16.10.0-alpine3.13
# Install serve - a static file serving package
RUN npm install -g serve
# Copy the build directory from the build-stage to the current stage
COPY --from=build-stage /app/dist /app
# Expose the port 5000
EXPOSE 5000
# Command to serve the application
CMD ["serve", "-s", "/app", "-p", "5001"]