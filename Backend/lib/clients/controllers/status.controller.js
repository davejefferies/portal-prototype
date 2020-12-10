const statusModel = require('../../common/models/status.model');

exports.get = async (req, res) => {
	let statuses = await statusModel.findAll().catch((error) => { return res.status(400); });
	return res.status(200).send(statuses);
};