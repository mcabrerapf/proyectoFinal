const mongoose = require('mongoose')
//const MongoClient = = require('mongodb').MongoClient
mongoose.Promise = global.Promise;

const urlDB = 'mongodb://localhost:27017/pFinal'

const db = mongoose.connection;
db.on('error', () => console.log('connection error:') );
db.once('open', () => console.log("We're connected") );

mongoose.connect( urlDB );

module.exports = mongoose;