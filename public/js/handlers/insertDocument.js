//Funcion para introducir nuevo usuario a la base de datos
function insertDocument(db, req, res) {
	const userInputs = req.body;
	db.collection('datos').insertOne( {
		"userName": userInputs.userNameInput,
		"pass": userInputs.passInput,
		"name": userInputs.nameInput,
		"instrument": userInputs.instrumentInput.split(", "),
		"genre": userInputs.genreInput.split(", "),
		"studies": userInputs.studiesInput.split(", "),
		"material": userInputs.materialInput.split(", "),
		"local": userInputs.localInput,
		"teacherAvailable": userInputs.optionTeacher,
		"band": userInputs.bandInput.split(", "),
		'description': userInputs.descInput,
		"pic": userInputs.picInput,
		"email": userInputs.emailInput,
		"phone": userInputs.phoneInput,
		"audios": userInputs.audioInput.split(", ")

	}, function(err, result) {
		if (err) console.log(err)
			console.log("Inserted a document into the collection.");
	});
	res.redirect("/sign-up-success")
};


module.exports.insertDocument = insertDocument