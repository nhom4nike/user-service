FROM node:lts-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only=production 

COPY .env* ./
COPY src ./src/
COPY www ./www/

CMD [ "npm", "run", "start:docker" ]
