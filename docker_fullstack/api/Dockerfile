FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g nodemon && npm install

COPY . .

CMD ["npm", "start"] 