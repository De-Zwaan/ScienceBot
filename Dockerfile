FROM node:current
WORKDIR /discordBot
COPY package.json /discordBot
RUN npm install
COPY . /discordBot
CMD ["node", "app.js"]