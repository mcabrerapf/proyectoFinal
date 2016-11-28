
function getMusicians(db, req, res)  {

	// const { skip, limit, projection } = req
	
	const ObjectID = require('mongodb').ObjectID;
	const { instrumentSearch, localSearch, teacherSearch, bandSearch, idSearch, genreSearch } = req.body;
	const filter = {};
	
	if (bandSearch) {
		const bands = bandSearch.split(",");
		filter.band = { $in: bands }
	}
	if (genreSearch) {
		const bands = genreSearch.split(",");
		filter.genre = { $in: genre }
	}
	if (instrumentSearch) {
		const instrument = instrumentSearch.split(",");
		filter.instrument = { $in: instrument }
	}
	if(localSearch){
		filter.local = localSearch;
	}
	if(teacherSearch){
		filter.teacherAvailable = teacherSearch;
	}
	// if(idSearch){
	// 	filter._id = ObjectID(idSearch);
	// }
	console.log( filter )
	
	db.collection('datos')
	.find( filter )
	// .limit( limit )
	// .skip( skip )
	.toArray()
	.then( data  => {
		res.render('results', {data})	
	})
	.catch( err => console.log(err) )

}

module.exports.getMusicians = getMusicians


// functions.login = function( req, res){
// 	res.render('login', {title: ' Login'});
// };
// functions.user = function ( req, res){
// 	if ( req.session.passport.user == undefined) {
// 		res.redirect('/login');
// 	}else{
// 		res.render('/user', {title: 'Welcome! ', user: req.user});
// 	};
// };