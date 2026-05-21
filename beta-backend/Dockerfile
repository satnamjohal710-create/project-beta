# Step 1: Use the official Node image
FROM node:18-alpine

# Step 2: Set the internal container directory
WORKDIR /usr/src/app

# Step 3: Copy package files from the subfolder and install production dependencies
COPY beta-backend/package*.json ./
RUN npm install --only=production

# Step 4: Copy your actual backend subfolder code into the container image
COPY beta-backend/ .

# Step 5: Expose Port 5001 to accept network traffic
EXPOSE 5001

# Step 6: Define the execution command to launch the app
CMD [ "node", "server.js" ]