'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const validUrl= require('valid-url');
const dns = require('dns');
const shortUrl = require('./mongodbs.js');
mongoose.Promise = global.Promise;
var cors = require('cors');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGOLAB_URI,{ useMongoClient: true });

app.use(cors());

app.use('/public', express.static(process.cwd() + '/public'));



app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/shorturl/:id',(req,res,next) => {
let use= req.params.id;
  shortUrl.findOne({'short_url': use},(err,data) => {
  if(err) res.json({'error': "invalid url"});
    else{
     let regexp = new RegExp("^(http|https)://","i");
      if(regexp.test(data['original_url'])===true){
        res.redirect(301,data['original_url']);
      }
      else{
        
        res.redirect(301,'http://'+ data['original_url']);
      }
    }
  });

});

app.post("/api/shorturl/new",(req,res) => { 
  //console.log(req.body);
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  
  const url= req.body.url;
if(regex.test(url)===true){
  
  let document= new shortUrl({
 'original_url' : url,
  'short_url' : Math.floor(Math.random()*10000),
});
  
  document.save(err => {
  if(err) res.send('Error saving data to database');
  });
  
  res.json({
  'original_url' : document['original_url'],
  'short_url' : document['short_url']
 });

} 
  
  
else { 
res.json({"error":"invalid URL"});
}
  
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});