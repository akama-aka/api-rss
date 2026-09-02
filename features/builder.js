class buildJsonRss {
    #version = "https://jsonfeed.org/version/1.1";
    constructor(title,description) {
        this.title = title;
        this.description = description;
        this.version = this.#version;
    }
    #items = [];
    /**
     * 
     * @param {string} id - id is unique for that item for that feed over time.
     * @param {string} url - url is the URL of the resource described by the item.
     * @param {string} title - title is plain text. Microblog items in particular may omit titles.
     * @param {string} text - This is the plain text of the item.
     * @param {string} summary - summary is a plain text sentence or two describing the item.
     * @param {string} banner - banner is the URL of an image to use as a banner
     * @param {string} published - published specifies the date in RFC 3339 format.
     * @param {Array} authors - authors has the same structure as the top-level authors.
     */
    item(id,url,title,text = null,summary,banner = null,published,authors = []) {
        const data = {
            id,
            content_text: text,
            summary,
            banner_image: banner,
            date_published: published,
            authors
        }
        this.#items.push(data);
    }

    get feed() {
        return {
            version: this.version,
            title: this.title,
            description: this.description,
            items: this.#items
        };
    }
}

const test = new buildJsonRss("Test","This is a test Feed");
test.item("1","https://google.com","Feed 1","This is a very long text","This is a short text","https://google.com/image","1234567",["Austin"])
test.item("2","https://google.com","Feed 2","This is a very long text","This is a short text","https://google.com/image","1234567")
console.log(test.feed);
