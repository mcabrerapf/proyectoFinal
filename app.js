const express = require('express')
const bodyparser = require('body-parser')
const fs = require('fs');
const http = require('http');
const router = express.Router()
require('./db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash');
const user = require('./models/user');
const routes = require('./routes')
const PORT = 3000; 	
const app = express()

if ( fs.existsSync('.env') ) { // exists
	require('dotenv').load()
}

app.use( express.static('public') )
app.set('view engine', 'pug')
app.use( bodyparser.urlencoded({ extended: false }) )
app.use('/', routes)
// app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( session({ secret: 'supersecretworddonottelltoanyone'}) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( flash() );

var Account = require('./models/account');
passport.use( new LocalStrategy( Account.authenticate() ) );
passport.serializeUser( Account.serializeUser() );
passport.deserializeUser( Account.deserializeUser() );

// const routerAuthLocal = require('./routes')
// app.use('./routes', routerAuthLocal)

// routes
// app.get('/', function (req, res) {
// 	const user = req.user;
// 	const auth_method = AUTH;
//   res.render('index', { user, auth_method });
// });
// app.get('/account', isAuthenticated, (req, res) => {
// 	const userId = req.session.passport.user;
// 	const message = req.flash('message');
// 	User.findById( userId )
// 		.then( user => res.render( 'account', { user, message } ) )
// 		.catch( console.log )
// });
// app.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/');
// });
// test authentication
function isAuthenticated(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/');
}



// const getMusicians = require("./public/js/handlers/getMusicians.js").getMusicians;
// const insertDocument = require("./public/js/handlers/insertDocument.js").insertDocument;
// const getUserById = require("./public/js/handlers/getUserById.js").getUserById;
// const prepareParams = require('./middleware/prepareParams')

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`) )

module.exports = app;
