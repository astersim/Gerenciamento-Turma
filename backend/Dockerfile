FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p ../generated/prisma_client

RUN npx prisma generate

EXPOSE 3000

CMD [ "npm", "run", "dev" ]