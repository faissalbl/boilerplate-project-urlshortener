require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const { 
    createShortUrl, 
    getOriginalUrl 
} = require('./services/ShortUrlService');

const databaseService = require('./services/DatabaseService');
databaseService.connect();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res, next) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', (req, res, next) => {
      createShortUrl(req.body.url).then(shortUrl => {
        // replit doesn't like exceptions. So I'm handling this
        // error alternatively using a flag.
        if (!shortUrl) return next(new Error('invalid url'));
        res.json({ 
          original_url : shortUrl.originalUrl, 
          short_url : shortUrl.shortUrl,
        });
      }).catch(err => next(err));
});

app.get('/api/shorturl/:shortUrlId', (req, res, next) => {
    getOriginalUrl(req.params.shortUrlId).then(originalUrl => {
      res.redirect(originalUrl);
    }).catch(err => next(err));
});

app.use((err, req, res, next) => {
    res.status = err.status || 500;
    res.json({ error: err.message || "Something broke!" });
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});
