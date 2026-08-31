const fs = require('node:fs');
const cheerio = require('cheerio');
const axios = require('axios');
const client = axios.create({
    baseURL: 'https://ask.vrchat.com/c',
    headers: {
        "User-Agent":"VR Stoat Community Scraper/1.0.0",
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
})

function getPosts() {
    client.get('/official/31').then(function (response) {
        console.debug(response.data);
        const $ = cheerio.load(response.data);
        const feeds = [];
        fs.writeFileSync('vrcForum.out.html', response.data, {encoding:'utf-8'})
        $('body.category-official>section#main.ember-application>div#ember3>div#main-outlet>div.container.list-container.--topic-list>div.row.full-width>div#ember31.contents.ember-view>table.topic-list>tbody.topic-list-body>tr.topic-list-item>td.topic-list-data').each((index, element ) => {
            const title = $(element).find('a.title')
            
            console.log("--- Titles ---")
            console.log(title);
        })
    })
}

getPosts();