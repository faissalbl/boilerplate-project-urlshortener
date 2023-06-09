const dns = require('dns');
const ShortUrl = require('../models/ShortUrl');

function validateUrl(url) {
    return new Promise((resolve, reject) => {
        dns.lookup(url, (err, res) => { 
            if (err) return resolve(false);
            resolve(res);
        });
    });
}

async function createShortUrl(url) {
    const res = await validateUrl(url);
    if (!res) return res;
  
    let shortUrl = new ShortUrl({ originalUrl: url });
    shortUrl = await shortUrl.save();
    return shortUrl;
}

async function getOriginalUrl(shortUrlId) {
    const shortUrl = await ShortUrl.findOne({ shortUrl: shortUrlId }).orFail();
    return shortUrl.originalUrl;
}

module.exports = {
    createShortUrl,
    getOriginalUrl,
}