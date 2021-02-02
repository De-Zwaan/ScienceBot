FROM node:14.15.4
WORKDIR /usr/scr/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]
