FROM node:lts-alpine
RUN apk update && \
    apk upgrade
COPY . .
ENV SERVER_HOST=0.0.0.0 \
    SERVER_PORT=80
USER node
CMD ["node","server.js"]