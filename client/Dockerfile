# client/Dockerfile
# Use a more recent Node.js version
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client code
COPY . .


# Expose the port the client runs on
EXPOSE 3300

# Start the Next.js application
CMD ["npm", "start"]
