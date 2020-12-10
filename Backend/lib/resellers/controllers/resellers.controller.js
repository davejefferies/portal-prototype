const resellerModel = require('../models/resellers.model'),
      crypto = require('crypto');
			
exports.getAll = (req, res) => {
	return resellerModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};
			
exports.getById = (req, res) => {
	return resellerModel.findById(req.params.id).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getCount = (req, res) => {
	return resellerModel.findCount().then((result) => {
		return res.json(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.createReseller = async (req, res) => {
	return resellerModel.create(req.body).then((result) => {
		if (!result.insertId)
			return res.status(400).json('An error occurred.');
		req.body.id = result.insertId;
		return res.json(req.body);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.updateReseller = async (req, res) => {
	return resellerModel.update(req.body).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};