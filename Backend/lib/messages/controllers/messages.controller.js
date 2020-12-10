const messageModel = require('../models/messages.model'),
      sentModel = require('../models/message-sent.model'),
      statusModel = require('../models/message-status.model'),
			typeModel = require('../models/message-types.model'),
      crypto = require('crypto');
			
exports.getStatuses = (req, res) => {
	return statusModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getTypes = (req, res) => {
	return typeModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getAll = (req, res) => {
	return messageModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getByReseller = (req, res) => {
	
};

exports.getByUser = (req, res) => {
	
};

exports.getById = (req, res) => {
	return messageModel.findById(req.params.id).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getMessageCount = (req, res) => {
	return messageModel.findCount(1).then((result) => {
		return res.json(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getAlertCount = (req, res) => {
	return messageModel.findCount(2).then((result) => {
		return res.json(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};