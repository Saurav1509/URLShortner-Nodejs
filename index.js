//require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
// var validUrl = require('valid-url');
const dns = require("dns");
const url = require('url'); 
const { parse } = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


let originalurl;
let r = (Math.random() + 1).toString(36).substring(7);

app.post('/api/shorturl', bodyParser.urlencoded(), (req,res) =>{
  console.log(req.body.url)
  originalurl = req.body.url;
  r = (Math.random() + 1).toString(36).substring(7);

  // let url = originalurl
  // if (validUrl.isUri(url)){
  //   res.json({ original_url : originalurl, short_url : 1});
  // } 
  // else {
  //   res.json({ error: 'invalid url' });
  // }
  const parsedLookupUrl = url.parse(originalurl);
  console.log(parsedLookupUrl.host)

  dns.lookup(parsedLookupUrl.host, (error, address, family) => {
  
    // if an error occurs, eg. the hostname is incorrect!
    if (error) {
      res.json({ error: 'invalid url' });
    } else {
      // if no error exists
      res.json({ original_url : JSON.stringify(originalurl), short_url : 1});
    }
  });

  
});

app.get(`/api/shorturl/1`, (req, res) => {
  console.log(originalurl);
  res.redirect(originalurl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
