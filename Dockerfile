FROM node:14
WORKDIR /usr/scr/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]