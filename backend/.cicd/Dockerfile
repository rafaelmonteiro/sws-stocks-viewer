FROM node:19-alpine

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

## If building for production
## RUN npm ci --only=production

## Bundle app source
COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
