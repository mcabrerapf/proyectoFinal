const express = require('express')
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();

router.get('/', (req, res) => {
	res.render("index.pug")
})
router.get('/sign-up', (req, res) => {
	res.render("sign-up.pug")
})
router.get('/sign-up-success', (req, res) => {
	res.render("sign-up-success.pug")
})
router.get('/home', (req, res) => {
	res.render("index.pug")
})
router.get('/user/:id', (req, res) =>{
	var id = req.params.id
	Account.findById(id, (err, user) => {
		console.log(user)
		res.render('user.pug', {user})	
	})
	
})
router.get('/search', (req, res) => {
	res.render("search.pug")
})
router.get('/results', (req, res) => {
	res.render("results.pug")
})

router.post('/sign-up', (req,res) => {
	var userInputs = req.body
	userInputs.instrument = userInputs.instrument.split(", ");
	userInputs.genre = userInputs.genre.split(", ");
	userInputs.studies = userInputs.studies.split(", ");
	userInputs.material = userInputs.material.split(", ");
	userInputs.band = userInputs.band.split(", ");
	userInputs.audios = userInputs.audios.split(", ");

	
	const password = req.body.password;

	delete userInputs.password;

	Account.register( new Account(userInputs), password, (err, account) => {
		if (err) return res.render('sign-up', { account : account });
		passport.authenticate('local')(req, res, () =>  
			res.redirect('/search') );
	});
})
router.get('/login', function(req, res) {
	res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});
router.post('/search', (req,res) => {
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
		res.render("results", {users})
	})

})

module.exports = router;