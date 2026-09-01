const path = require('node:path');
const fs = require('node:fs');
const cheerio = require('cheerio');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { XMLParser } = require('fast-xml-parser');
const client = axios.create({
    baseURL: 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002',
    headers: {
        "User-Agent":"VR Stoat Community Scraper/1.0.0-DEV +https://rss.kitsune.exposed/bot",
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*\/*;q=0.8'
    }
})


function getPosts() {
    return client.get('/?appid=2519830&count=4&maxlength=300&format=json').then(function (response) {
        if(response.status != 200)
            throw new Error("There was an error getting the VRChat Dev Updates Data")
        const rawFeeds = response.data.appnews.newsitems;
        let feeds = [];
        rawFeeds.forEach((feed) => {
            const title = feed.title;
            const createdAt = feed.date;
            const excerpt = feed.contents;
            const id = feed.gid;
            const url = feed.url;
            const author = feed.author;
            feeds.push({id,title,createdAt,excerpt,url,author})
        })
        return feeds;
    })
}

async function createRssResoniteUpdates() {
    const parser = new XMLParser();
    const RSS = require('rss');
    const feed = new RSS({
        title: "Resonite Updates",
        feed_url: process.env.SERVER_DOMAIN,
        site_url: "https://store.steampowered.com/app/2519830/Resonite/",
        copyright: "Resonite / Steam / Valve",
        ttl: 5
    })
    const feeds = await getPosts();
    let changed = false;
    for(const itemSource of await feeds) {
        await feed.item({
            title: itemSource.title,
            description: itemSource.excerpt,
            date: itemSource.createdAt,
            url: itemSource.url,
            guid: itemSource.id,
            author: itemSource.author
        })
    }
    fs.writeFileSync(path.join(__dirname,'..','rss','resoniteUpdates.xml'), await feed.xml(), {encoding: 'utf-8', flush:true})
}

createRssResoniteUpdates();
module.exports = {
    createRssResoniteUpdates
}