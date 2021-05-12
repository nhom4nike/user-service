FROM node:14

RUN apt-get update && apt-get upgrade -y

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci 

COPY . .

CMD [ "npm", "test" ]
