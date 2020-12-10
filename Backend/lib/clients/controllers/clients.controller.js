const clientModel = require('../models/clients.model'),
      statusModel = require('../../common/models/status.model'),
			orderModel = require('../../orders/models/orders.model'),
      crypto = require('crypto');

exports.getClients = async (req, res) => {
	if (!req.jwt || !req.jwt.resellerId)
		return res.status(400).json('No Reseller is assigned to you.');
	let clients = await clientModel.findByReseller(req.jwt.resellerId).catch((error) => { return res.status(200).send([]) });
	if (!clients) return res.status(200).send([]);
	let statuses = await statusModel.findAll().catch((error) => { return res.status(200).send(clients) });
	let orders = await orderModel.findAll().catch((error) => { return res.status(200).send(clients) });
	clients.forEach((client) => {
		let o = 0;
		let s;
		if (orders)
			o = orders.filter((obj) => { return obj.client == client.id }).length;
		client.orders = o;
		if (statuses)
			s = statuses.filter((obj) => { return obj.id == client.status_id; })[0];
		if (s)
			client.status = s.name;
		else
			client.status = 'ERROR';
	});
	return res.status(200).send(clients);
};

exports.getClientsByReseller = async (req, res) => {
	if (!req.params.resellerId)
		return res.sendStatus(403);
	let clients = await clientModel.findByReseller(req.params.resellerId).catch((error) => { return res.status(200).send([]) });
	if (!clients) return res.status(200).send([]);
	let statuses = await statusModel.findAll().catch((error) => { return res.status(200).send(clients) });
	let orders = await orderModel.findAll().catch((error) => { return res.status(200).send(clients) });
	clients.forEach((client) => {
		let o = 0;
		let s;
		if (orders)
			o = orders.filter((obj) => { return obj.client == client.id }).length;
		client.orders = o;
		if (statuses)
			s = statuses.filter((obj) => { return obj.id == client.status_id; })[0];
		if (s)
			client.status = s.name;
		else
			client.status = 'ERROR';
	});
	return res.status(200).send(clients);
};

exports.getClientById = (req, res) => {
	return clientModel.findById(req.params.clientId).then((result) => {
		if (!result)
			return res.status(200).send([]);
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getClientCount = (req, res) => {
	return clientModel.countByReseller(req.params.resellerId ? req.params.resellerId : req.jwt.resellerId).then((result) => {
		return res.json(result);
	}).catch((error) => {
		return res.json(0);
	});
};

exports.createClient = (req, res) => {
	return clientModel.create(req.body).then((result) => {
		if (!result.insertId)
			return res.status(400).json('An error occurred.');
		req.body.id = result.insertId;
		return res.json(req.body);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.updateClient = (req, res) => {
	return clientModel.update(req.body).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.deactivateClient = async (req, res) => {
	let clients = await clientModel.findByReseller(req.body.reseller_id).catch((error) => { return res.sendStatus(400); });
	req.body.items.forEach(async (id) => {
		let client = clients.filter((obj) => { return obj.id == id; })[0];
		if (client) {
			client.status_id = 5;
			await clientModel.update(client).catch((error) => { console.log(error); });
		}
	});
	return res.status(200).json({success: true});
};