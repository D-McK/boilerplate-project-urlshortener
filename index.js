require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("node:dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const shortenedURLs = {};

app.post("/api/shorturl", (req, res) => {
  const randomShortURL = Math.floor(Math.random() * 10000);
  const url = new URL(req.body.url);
  dns.lookup(url.hostname, (err) => {
      if (err) return res.json({error: 'invalid url'});
      shortenedURLs[randomShortURL] = req.body.url;
      return res.json({original_url: req.body.url, short_url: randomShortURL});
    })
});

app.get("/api/shorturl/:short_url", (req, res) => {
  if(!shortenedURLs[req.params.short_url]){
    return res.json({error: "No short URL found for the given input"});
  }
  return res.redirect(301, shortenedURLs[req.params.short_url]);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
