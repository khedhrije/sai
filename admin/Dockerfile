# Stage 1: Build the app
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app's source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Set working directory to Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy the built app from the previous stage
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY ./docker/entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose the port Nginx will run on
EXPOSE 5173

# Use the entrypoint script to start Nginx
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
