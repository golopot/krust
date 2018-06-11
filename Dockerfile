FROM node:10
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN npm install -g pm2
RUN yarn
COPY . .
RUN yarn build
EXPOSE 9090
WORKDIR /usr/src/app/server
ENTRYPOINT ["pm2-docker", "server.js"]
