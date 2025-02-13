# Dockerfile for Invoice Service
FROM node:18

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:prod"]
