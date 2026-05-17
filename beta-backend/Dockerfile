# Step 1: Use an official light Node runtime base image
FROM node:18-alpine

# Step 2: Set the internal container directory
WORKDIR /usr/src/app

# Step 3: Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Step 4: Copy your actual server.js code into the container image
COPY . .

# Step 5: Expose Port 5001 to accept network traffic
EXPOSE 5001

# Step 6: Define the execution command to launch the app
CMD [ "node", "server.js" ]
