FROM node

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=qwerty 

RUN mkdir -p testapp

COPY . /testapp

CMD ["node","/testapp/server.js"]
 
# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5050

# Start the app
CMD ["node", "server.js"]

    