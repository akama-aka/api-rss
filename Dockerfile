FROM node:lts-alpine
RUN apk update && \
    apk upgrade
COPY . /app
ENV SERVER_HOST=0.0.0.0 \
    SERVER_PORT=80
WORKDIR /app
RUN chown node:node /app -R
USER node
RUN npm install
CMD ["node","server.js"]