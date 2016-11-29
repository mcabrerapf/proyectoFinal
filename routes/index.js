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
	res.render("sign-up-success.pug")
})
router.get('/home', (req, res) => {
	const user = req.user
	res.render("index.pug", { user})
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


router.post('/sign-up', (req,res) => {
	let { username, password, instrument, genre, studies, material, band, audios} = req.body;

	instrument = instrument.split(", ");
	genre = genre.split(", ");
	studies = studies.split(", ");
	material = material.split(", ");
	band = band.split(", ");
	audios = audios.split(", ");

	const musician = new Account({ username, instrument, genre, studies, material, band, audios})

	Account.register( musician, password, (err, account) => {
		if (err) return res.render('sign-up', { account : account });
		passport.authenticate('local')(req, res, () => res.redirect('/search') ) });

})

// router.post('/sign-up', (req,res) => {
// 	var userInputs = req.body
// 	userInputs.instrument = userInputs.instrument.split(", ");
// 	userInputs.genre = userInputs.genre.split(", ");
// 	userInputs.studies = userInputs.studies.split(", ");
// 	userInputs.material = userInputs.material.split(", ");
// 	userInputs.band = userInputs.band.split(", ");
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
	var { instrument, local, teacherAvailable, band, genre } = req.body;
	if (band) {
		console.log("we are in band")
		bands = band.split(",");
		filter.band = { $in: bands }
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
	
	Account.find( filter, function (err, users) {
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

router.post('/login', passport.authenticate('local', { successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true 
})
);

module.exports = router;