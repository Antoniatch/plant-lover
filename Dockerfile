FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src src
COPY prisma prisma
COPY tsconfig.json tsconfig.json

RUN npm run prisma-client