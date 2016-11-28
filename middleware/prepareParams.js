function prepareParams(req, res, next) {

	const limit = +req.query.size || 20;
	const page = +req.query.page || 1;
	const skip = (limit*(page-1))+1;
	const fields = req.query.fields;

	if (fields) {

		const projection = fields.split(',').reduce( (oProj, field) => {
			oProj[field] = 1;
			return oProj;
		}, {} )

		req.projection = projection;
	}

	req.limit = limit;
	req.skip = skip;

	next()
}

module.exports = prepareParams