const path = require('node:path');
const fs = require('node:fs');
const cheerio = require('cheerio');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { XMLParser } = require('fast-xml-parser');
const client = axios.create({
    baseURL: 'https://ask.vrchat.com/c',
    headers: {
        "User-Agent":"VR Stoat Community Scraper/1.0.0-DEV",
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*\/*;q=0.8'
    }
})


function getPosts() {
    return client.get('/official/dev-updates/32/l/latest.json?filter=default').then(function (response) {
        if(response.status != 200)
            throw new Error("There was an error getting the VRChat Dev Updates Data")
        const rawFeeds = response.data.topic_list.topics;
        let feeds = [];
        rawFeeds.forEach((feed) => {
            const title = feed.title;
            const imageUrl = feed.image_url;
            const createdAt = feed.created_at;
            const excerpt = feed.excerpt;
            const views = feed.views;
            const likeCount = feed.like_count;
            const id = feed.id;
            const url = `https://ask.vrchat.com/t/${feed.slug}/${id}`
            feeds.push({id,title,imageUrl,createdAt,excerpt,views,likeCount,url})
        })
        return feeds;
    })
}

async function createRssVRChatDevUpdates() {
    const parser = new XMLParser();
    const RSS = require('rss');
    const feed = new RSS({
        title: "VRChat Developer Updates",
        feed_url: process.env.SERVER_DOMAIN,
        site_url: "https://ask.vrchat.com/c/official/dev-updates/",
        copyright: "VRChat",
        ttl: 5
    })
    const feeds = await getPosts();
    let changed = false;
    for(const itemSource of await feeds) {
        if(itemSource.title === "About the Dev Updates category")
            continue;
        await feed.item({
            title: itemSource.title,
            description: itemSource.excerpt,
            date: itemSource.createdAt,
            url: itemSource.url,
            guid: itemSource.id
        })
    }
    fs.writeFileSync(path.join(__dirname,'..','rss','vrchatDevUpdates.xml'), await feed.xml(), {encoding: 'utf-8', flush:true})
}

/**
 * @deprecated This is deprecated and should not be used anymore.
 */
function getPostsByScraper() {
    client.get('/official/31').then(function (response) {
        //const data = fs.readFileSync(path.join(__dirname,'..','vrcForum.out.html'), {encoding: 'utf-8'})
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        // Step 1, get the title & url from the List
        const feeds = [];
        const articles = document.querySelectorAll('tr.topic-list-item');
        articles.forEach((article) => {
            console.debug(article)
            const title = article.querySelector('tr.topic-list-item td.main-link span.link-top-line a.title')?.textContent.trim();
            const url = article.querySelector('tr.topic-list-item td.main-link span.link-top-line a')?.href.trim();
            const category = article.querySelector('tr.topic-list-item td.main-link div.link-bottom-line a.badge-wrapper span.badge-category span.category-name')?.textContent.trim();
            const categoryColour = article.querySelector('tr.topic-list-item td.main-link div.link-bottom-line a.badge-wrapper span.badge-category-bg')?.style.backgroundColor;
            feeds.push({title, url});
        })

        console.log(feeds.slice(0,3));

    })
}
module.exports = {
    createRssVRChatDevUpdates
}