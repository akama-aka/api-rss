require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const fastify = require('fastify');
const { createRssVRChatDevUpdates } = require('./api/vrchat.forum');
const server = new fastify({
    logger:true
});
setInterval(() => {
    console.info("Updating Feeds")
    createRssVRChatDevUpdates()
}, 1000 * 60 * 5)

server.get("/rss/vrchat/dev-updates", (req, rep) => {
    const file = fs.readFileSync(path.join(__dirname,'rss','vrchatDevUpdates.xml'), {encoding: 'utf-8'});
    rep.headers({"Content-Type": "application/rss+xml;charset=UTF-8"}).send(file);
})

server.get("/bot", (req, rep) => {
    rep.headers({"Content-Type":"text/plain"});
    rep.send(`User-Agent: VR Stoat Community Scraper/1.0.0-DEV +https://rss.kitsune.exposed/bot\nIP: ${process.env.SERVER_IP || "Not Defined"}\nContact: ${process.env.WEBMASTER_CONTACT || "Not Defined"}\nCrawl Interval: ~5 Minutes`)
})

server.listen({host: process.env.SERVER_HOST || "127.0.0.1",port: process.env.SERVER_PORT || 8080})