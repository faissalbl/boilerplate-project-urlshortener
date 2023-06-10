const dns = require('dns');
const ShortUrl = require('../models/ShortUrl');

function validateUrl(pUrl) { 
    return new Promise((resolve, reject) => {
        let url;
        try {
            url = new URL(pUrl);
        } catch(err) {
            return resolve(false);
        }
      
        dns.lookup(url.host, (err, res) => { 
            if (err) return resolve(false);
            resolve(res);
        });
    });
}

async function createShortUrl(pUrl) {
    const res = await validateUrl(pUrl);
    if (!res) return res;
  
    let shortUrl = new ShortUrl({ originalUrl: pUrl });
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
