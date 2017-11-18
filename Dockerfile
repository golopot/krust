FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run pack
EXPOSE 9090
CMD cd server && node server.js
