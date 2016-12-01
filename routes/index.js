const express = require('express')
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();

router.get('/', (req, res) => {
	const user = req.user
	res.render("index.pug", { user})
})
router.get('/sign-up', (req, res) => {
	const user = req.user
	res.render("sign-up.pug", { user })
})
router.get('/sign-up-success', (req, res) => {
	const user = req.user
	res.render("sign-up-success.pug", {user})
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
		if(user){
			console.log("looping")
			for(i=0; i<userById.friendRequestRecieved.length; i++ ){
				var friendPending
				console.log("comparing > " + userById.friendRequestRecieved[i]._id + " <  with > " + user._id +"<")
				if(String(userById.friendRequestRecieved[i]._id) == String(user._id)){
					console.log("tiene request")
					friendPending = true
				}
				
			}
			for(i=0; i<user.friends.length; i++ ){
				console.log("mega looper")
				var buddies
				console.log("comparing > " + user.friends[i]._id + " <  with > " + userById._id +"<")
				if(String(user.friends[i]._id) == String(userById._id)){
					console.log("son amigos")
					buddies = true
				}
				
			}
			for(i=0; i<user.friendRequestRecieved.length; i++ ){
				console.log("friend pending looper")
				var friendRequestPending
				console.log("comparing > " + user.friendRequestRecieved[i]._id + " <  with > " + userById._id +"<")
				if(String(user.friendRequestRecieved[i]._id) == String(userById._id)){
					friendRequestPending = true
					console.log("friend request pending")
				}
				
			}
		}
		res.render('user.pug', {userById, user, friendPending, buddies, friendRequestPending})	
	})
	
})
router.get('/search', (req, res) => {
	const user = req.user
	res.render("search.pug", { user })
})
router.get('/results', (req, res) => {
	const user = req.user
	res.render("results.pug", { user })
})
router.post('/user/:id', (req, res) =>{
	const user = req.user
	var id = req.params.id
	let { comment } = req.body
	if(comment){
		Account.update({"_id" : id}, {$push: { "comments": { "_id": user._id, "comment": comment, "username": user.username, "name": user.name} }}, function (err, result) {
			if (err) return (err);
			console.log("updated sucessfuly")
			res.redirect('/user/' + id)
		})
	}else if(req.body.acceptFriend){
		Account.update({"_id" : user._id}, {$push: { "friends": { "_id": req.body._id, "username": req.body.username, "name": req.body.name} }}, function (err, result) {
			if (err) return (err);
			console.log("ADDED FRIEND ==> " + req.body.name)
			Account.update({"_id" : user._id}, {$pull: {'friendRequestRecieved': {'username': req.body.username}}}, function (err, result) {
				if (err) return (err);
				console.log("friend recieved removed sucessfuly")
				Account.update({"username" : req.body.username}, {$push: {'friends': {'_id': user._id, 'username': user.username, "name": user.name}}}, function (err, result) {
					if (err) return (err);
					console.log("friend request removed sucessfuly")
					Account.update({"username" : req.body.username}, {$pull: {'friendRequestSent': {'username': user.username}}}, function (err, result) {
						if (err) return (err);
						console.log("friend request removed sucessfuly")
						res.redirect('/main-user/' + user._id)
					})

				})

			})
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
	let { name, username, password, instrument, genre, studies, material, bands, teacherAvailable, description, local,email, phone} = req.body;

	instrument = instrument.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	genre = genre.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	studies = studies.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	material = material.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")
	bands = bands.toLowerCase().replace(/\b[a-z]/g,function(f){return f.toUpperCase();}).split(", ")

	const musician = new Account({ name, username, instrument, genre, studies, material, bands, teacherAvailable, description, local,email, phone})

	Account.register( musician, password, (err, account) => {
		if (err) 
		{
			var erMessage = "The username is already taken"
			return res.render('sign-up', {  erMessage });
		}
		passport.authenticate('local')(req, res, () => res.redirect('/sign-up-success') ) });

})
router.post('/main-user/', (req, res) =>{
	const user = req.user
	console.log( req.body)
	var index = req.body.index

	Account.update({"_id" : user._id}, {$push: { "friends": { "_id": req.body._id, "username": req.body.username, "name": req.body.name} }}, function (err, result) {
		if (err) return (err);
		console.log("ADDED FRIEND ==> " + req.body.name)
		Account.update({"_id" : user._id}, {$pull: {'friendRequestRecieved': {'username': req.body.username}}}, function (err, result) {
			if (err) return (err);
			console.log("friend recieved removed sucessfuly")
			Account.update({"username" : req.body.username}, {$push: {'friends': {'_id': user._id, 'username': user.username, "name": user.name}}}, function (err, result) {
				if (err) return (err);
				console.log("friend request removed sucessfuly")
				Account.update({"username" : req.body.username}, {$pull: {'friendRequestSent': {'username': user.username}}}, function (err, result) {
					if (err) return (err);
					console.log("friend request removed sucessfuly")
					res.redirect('/')
				})

			})
			
		})
	})
})



router.post('/search', (req,res) => {
	const user = req.user
	var noResults	
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
		if (users.length === 0){
			noResults = "check your spelling dumbfuck"
		}
		res.render("results", {users, user, noResults})
	})

})
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
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