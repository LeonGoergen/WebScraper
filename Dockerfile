FROM node:alpine as base

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules

COPY . .

CMD ["node", "./app.js"]