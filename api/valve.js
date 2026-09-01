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


function getPosts(appId) {
    return client.get(`/?appid=${appId}&count=4&maxlength=300&format=json`).then(function (response) {
        if(response.status != 200)
            throw new Error("There was an error getting the VRChat Dev Updates Data")
        const rawFeeds = response.data.appnews.newsitems;
        let feeds = [];
        rawFeeds.forEach((feed) => {
            let t = new Date(feed.date).toISOString;
            const title = feed.title;
            const createdAt = t;
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
    const feeds = await getPosts("2519830");
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

async function createRssBasisLabsUpdates() {
    const parser = new XMLParser();
    const RSS = require('rss');
    const feed = new RSS({
        title:"Basis Labs Updates",
        feed_url: process.env.SERVER_DOMAIN,
        site_url: "https://store.steampowered.com/app/3157090/Basis_Labs/",
        copyright: "Basis Labs / Steam / Valve",
        ttl: 5
    });
    const feeds = await getPosts("3157090");
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
    fs.writeFileSync(path.join(__dirname,'..','rss','basisLabsUpdates.xml'), await feed.xml(), {encoding: 'utf-8', flush: true})
}

async function createRssBeatSaberUpdates() {
    const parser = new XMLParser();
    const RSS = require('rss');
    const feed = new RSS({
        title: "BeatSaber Updates",
        feed_url: process.env.SERVER_DOMAIN,
        site_url: "https://store.steampowered.com/app/620980/Beat_Saber/",
        copyright: "BeatSaber / Steam / Valve",
        ttl: 5
    });
    const feeds = await getPosts("620980");
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
    fs.writeFileSync(path.join(__dirname,'..','rss','beatSaberUpdates.xml'), await feed.xml(), {encoding: 'utf-8', flush: true})
}
module.exports = {
    createRssResoniteUpdates,
    createRssBasisLabsUpdates,
    createRssBeatSaberUpdates
}