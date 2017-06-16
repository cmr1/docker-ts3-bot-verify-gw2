FROM node:6-slim

LABEL maintainer "Charlie McClung <charlie.mcclung@autodesk.com>"

ENV BOT_DIR=/bot

RUN mkdir -p $BOT_DIR

WORKDIR $BOT_DIR

COPY ./src/package.json .

RUN npm install

COPY ./src/ ./

CMD [ "npm", "start" ]