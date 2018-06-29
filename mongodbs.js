const mongoose= require('mongoose');

const Schema = mongoose.Schema;

const mod= new Schema({
'original_url' : String  ,
'short_url' : Number,
});

const Model= mongoose.model('shortUrl',mod);
module.exports = Model;