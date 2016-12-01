const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collection = 'datos';
const passportLocalMongoose = require('passport-local-mongoose');
// Schema definition
const Account = new Schema({
	username: String,
	password: String,
	name: String,
	instrument: [String],
	genre: [String],
	studies:[String],
	material:[String],
	local: String,
	teacherAvailable: String,
	bands: [String],
	description: String,
	// pic: String,
	email: String,
	phone: String,
	// audios: [String],
	comments:[{id: String, username: String, comment: String, name: String, date: String}],
	friendRequestSent: [{id: String, username: String, name: String, date: String}],
	friendRequestRecieved: [{id: String, username: String, name: String, date: String}],
	friends: [{id: String, username: String, name: String, date: String}]
});

// Model definition
Account.plugin( passportLocalMongoose );

module.exports = mongoose.model('datos', Account);