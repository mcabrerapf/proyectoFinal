const express = require('express')
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();

router.get('/', (req, res) => {
	const user = req.user
	console.log(user)
	res.render("index.pug", { user})
})
router.get('/sign-up', (req, res) => {
	const user = req.user
	res.render("sign-up.pug", { user })
})
router.get('/sign-up-success', (req, res) => {
	res.render("sign-up-success.pug")
})
router.get('/home', (req, res) => {
	const user = req.user
	res.render("index.pug", { user})
})
router.get('/main-user/:id', (req, res) => {
	const user = req.user
	res.render("main-user.pug", { user})
})
router.get('/user/:id', (req, res) =>{
	const user = req.user
	var id = req.params.id
	Account.findById(id, (err, userById) => {
		console.log(user)
		console.log(userById.friendRequestRecieved)
		if(user){
			console.log("looping")
			for(i=0; i<userById.friendRequestRecieved.length; i++ ){
				var friendPending
				console.log("comparing > " + userById.friendRequestRecieved[i]._id + " <  with > " + user._id +"<")
				console.log(typeof userById.friendRequestRecieved[i]._id )
				console.log(typeof user._id)
				if(userById.friendRequestRecieved[i]._id === user._id){
					friendPending = true

				}
				if (friendPending = true){break;}
			}
		}
		console.log("son amigos === " + friendPending)
		res.render('user.pug', {userById, user, friendPending})	
	})
	
})
router.get('/search', (req, res) => {
	const user = req.user
	res.render("search.pug", { user })
})
router.post('/user/:id', (req, res) =>{
	const user = req.user
	var id = req.params.id
	let { comment } = req.body
	if(comment){
		Account.update({"_id" : id}, {$push: { "comments": { "_id": user._id, "comment": comment, "username": user.username} }}, function (err, result) {
			if (err) return (err);
			console.log("updated sucessfuly")
			res.redirect('/user/' + id)
		})
	}else{
		console.log('sending friend request to ==>' + id + ' from user ==>' + user.username)
		Account.update({"_id" : id}, {$push: { "friendRequestRecieved": { "_id": user._id, "username": user.username, "name": user.name} }}, function (err, result) {
			if (err) return (err);
			console.log("friend request sent sucessfuly")
			Account.update({"_id" : user._id}, {$push: { "friendRequestSent": { "_id": id, "username": req.body.username, "name": req.body.name} }}, function (err, result) {
				if (err) return (err);
				console.log("friend request sent sucessfuly")
				res.redirect('/user/' + id)
			})
		})
	}
})
router.post('/sign-up', (req,res) => {
	let { name, username, password, instrument, genre, studies, material, bands, audios, teacherAvailable, local, pic, email, phone} = req.body;

	instrument = instrument.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	genre = genre.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	studies = studies.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	material = material.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	bands = bands.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	audios = audios.split(", ");

	const musician = new Account({ name, username, instrument, genre, studies, material, bands, audios, teacherAvailable, local, pic, email, phone})

	Account.register( musician, password, (err, account) => {
		if (err) 
		{
			var erMessage = "The username is already taken"
			return res.render('sign-up', { account : account, erMessage });
		}
		passport.authenticate('local')(req, res, () => res.redirect('/main-user/:id') ) });

})
router.post('/search', (req,res) => {
	const user = req.user
	console.log(req.body)
	var filter = {}
	var { instrument, local, teacherAvailable, bands, genre } = req.body;
	if (bands) {
		console.log("we are in bands")
		bands = bands.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
		filter.bands = { $in: bands }
	}
	if (genre) {
		genre = genre.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
		filter.genre = { $in: genre }
	}
	if (instrument) {
		console.log("we are in instruments")
		instrument = instrument.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
		filter.instrument = { $in: instrument }
	}
	if(local){
		filter.local = local;
	}
	if(teacherAvailable){
		filter.teacherAvailable = teacherAvailable;
	}
	
	Account.find( filter, function (err, users) {
		if (err) return (err);
		console.log(users)
		res.render("results", {users, user})
	})

})
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
router.get('/login', function(req, res) {
	res.render('login', {message: req.flash('error')});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/main-user/:id',
	failureRedirect: '/login',
	failureFlash: true 
})
);

module.exports = router;