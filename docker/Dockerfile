FROM node:18

RUN apt update && apt install -y sqlite3

RUN mkdir -p /home/node/app/node_modules

ARG PORT
ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

WORKDIR /home/node/app

COPY package*.json ./
RUN npm i -g rimraf
RUN npm i -D sqlite3
RUN rimraf node_modules
RUN npm i

COPY . .

RUN npm run seed

RUN chown -R node:node /home/node/app

USER node

EXPOSE $PORT

CMD [ "npm", "run", "start" ]
