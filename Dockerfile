FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .
COPY data/phrases/ /app/data/phrases/
RUN mkdir -p data/phrases

CMD ["node", "bot.js"]