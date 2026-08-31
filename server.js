require('dotenv').config();
const fastify = require('fastify');
const server = new fastify({
    logger:true
});



server.listen({host: process.env.SERVER_HOST || "127.0.0.1",port: process.env.SERVER_PORT || 8080})