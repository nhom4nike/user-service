FROM node:14

WORKDIR /usr/app
COPY package*.json ./
COPY .env ./
COPY src ./src/
COPY www ./www/
RUN npm ci --only=production 

EXPOSE 3001
CMD [ "npm", "start" ]
