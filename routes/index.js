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
		res.render('user.pug', {userById, user})	
	})
	
})
router.get('/search', (req, res) => {
	const user = req.user
	res.render("search.pug", { user })
})
router.get('/results', (req, res) => {
	const user = req.user
	res.render("results.pug")
})

router.post('/user/:id', (req, res) =>{
	const user = req.user
	var id = req.params.id
	let { comment } = req.body
	console.log(comment)
	if(comment){
		Account.update({"_id" : id}, {$push: { "comments": { "_id": user._id, "comment": comment, "username": user.username} }}, function (err, result) {
			if (err) return (err);
			console.log("updated sucessfuly")
			res.redirect('/user/' + id)
		})
	}else{
		console.log('sending friend request to ==>' + id + ' from user ==>' + user.username)
		Account.update({"_id" : id}, {$push: { "friendRequestRecieved": { "_id": user._id, "username": user.username} }}, function (err, result) {
			if (err) return (err);
			console.log("friend request sent sucessfuly")
			res.redirect('/user/' + id)
		})
	}
})
router.post('/sign-up', (req,res) => {
	let { name, username, password, instrument, genre, studies, material, bands, audios, teacherAvailable, local, pic, email, phone} = req.body;

	instrument = instrument.split(", ");
	genre = genre.split(", ");
	studies = studies.split(", ");
	material = material.split(", ");
	bands = bands.split(", ");
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

// router.post('/sign-up', (req,res) => {
// 	var userInputs = req.body
// 	userInputs.instrument = userInputs.instrument.split(", ");
// 	userInputs.genre = userInputs.genre.split(", ");
// 	userInputs.studies = userInputs.studies.split(", ");
// 	userInputs.material = userInputs.material.split(", ");
// 	userInputs.bands = userInputs.bands.split(", ");
// 	userInputs.audios = userInputs.audios.split(", ");


// 	const password = req.body.password;

// 	delete userInputs.password;

// 	Account.register( new Account(userInputs), password, (err, account) => {
// 		if (err) return res.render('sign-up', { account : account });
// 		passport.authenticate('local')(req, res, () =>  
// 			res.redirect('/search') );
// 	});
// })
router.post('/search', (req,res) => {
	const user = req.user
	console.log(req.body)
	var filter = {}
	var { instrument, local, teacherAvailable, bands, genre } = req.body;
	if (bands) {
		console.log("we are in bands")
		bands = bands.split(",");
		filter.bands = { $in: bands }
	}
	if (genre) {
		genre = genre.split(",");
		filter.genre = { $in: genre }
	}
	if (instrument) {
		console.log("we are in instruments")
		instrument = instrument.split(",");
		filter.instrument = { $in: instrument }
	}
	if(local){
		filter.local = local;
	}
	if(teacherAvailable){
		filter.teacherAvailable = teacherAvailable;
	}
	
	Account.find( new RegExp('^'+filter+'$', "i"), function (err, users) {
		if (err) return handleError(err);
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