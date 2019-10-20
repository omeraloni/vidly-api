FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

#RUN apt update 
#RUN apt install -y build-essential python
RUN npm install
RUN rm -rf node_modules/bcrypt
RUN npm install bcrypt
# If you are building your code for production
# RUN npm ci --only=production

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 4000

CMD [ "npm", "start" ]