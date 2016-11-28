
function getUserById(db, req, res)  {

	// const { skip, limit, projection } = req
	
	const ObjectID = require('mongodb').ObjectID;

	const filter = req.body.userID;

	console.log( filter )
	
	db.collection('datos')
	.find( filter )
	// .limit( limit )
	// .skip( skip )
	.toArray()
	// .then(console.log)
	.then( data  => {
		res.render('user', {data})	
	})
	.catch( err => console.log(err) )

}

module.exports.getUserById = getUserById;