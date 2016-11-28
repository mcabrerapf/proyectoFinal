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
	band: [String],
	description: String,
	pic: String,
	email: String,
	phone: Number,
	audios: [String]
});

// Model definition
Account.plugin( passportLocalMongoose );

module.exports = mongoose.model('datos', Account);