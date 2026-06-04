FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# generate prisma client
RUN npx prisma generate

# build NestJS app
RUN npm run build

EXPOSE 3000

# production start
CMD ["npm", "run", "start:prod"]