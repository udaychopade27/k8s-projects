FROM node:alpine

ENV MONGO_DB_USERNAME=root \
    MONGO_DB_PWD=example

COPY ./app /app
WORKDIR /app

RUN npm install
COPY . /app
EXPOSE 3000
CMD ["node", "server.js" ]
