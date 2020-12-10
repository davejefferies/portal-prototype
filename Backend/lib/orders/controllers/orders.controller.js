const orderModel = require('../models/orders.model'),
      itemModel = require('../models/order-items.model'),
			statusModel = require('../models/order-status.model'),
			typeModel = require('../models/order-types.model'),
			clientModel = require('../../clients/models/clients.model'),
      crypto = require('crypto');
			
exports.getTypes = (req, res) => {
	return typeModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getStatuses = (req, res) => {
	return statusModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getOrder = (req, res) => {
	return orderModel.findById(req.params.id).then((result) => {
		if (!result || !result.id)
			return res.status(400).send('Unable to find Order.');
		itemModel.findByOrder(result.id).then((items) => {
			result.items = items;
			return res.status(200).send(result);
		}).catch((error) => {
			return res.status(200).send(result);
		});
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getOrders = async (req, res) => {
	if (!req.jwt.resellerId)
		return res.status(400).json('No Reseller is assigned to you.');
	let orders = await orderModel.findByReseller(req.jwt.resellerId).catch((error) => {  });
	if (!orders)
		return res.status(200).json([]);
	let statuses = await statusModel.findAll().catch((error) => {  });
	let clients = await clientModel.findByReseller(req.jwt.resellerId).catch((error) => {  });
	if (!clients)
		return res.status(200).json(orders);
	orders.forEach((order) => {
		let c = clients.filter((obj) => { return obj.id == order.client; })[0];
		if (c)
			order.client_name = c.name;
		let s = statuses.filter((obj) => { return obj.id == order.status; })[0];
		if (s)
			order.status_name = s.value;
	});
	return res.status(200).json(orders);
};

exports.getOrderByReseller = async (req, res) => {
	if (!req.params.resellerId)
		return res.sendStatus(403);
	let orders = await orderModel.findByReseller(req.params.resellerId).catch((error) => {  });
	if (!orders)
		return res.status(200).json([]);
	let statuses = await statusModel.findAll().catch((error) => {  });
	let clients = await clientModel.findByReseller(req.params.resellerId).catch((error) => {  });
	if (!clients)
		return res.status(200).json(orders);
	orders.forEach((order) => {
		let c = clients.filter((obj) => { return obj.id == order.client; })[0];
		if (c)
			order.client_name = c.name;
		let s = statuses.filter((obj) => { return obj.id == order.status; })[0];
		if (s)
			order.status_name = s.value;
	});
	return res.status(200).json(orders);
};

exports.getOrderByClient = async (req, res) => {
	if (!req.params.resellerId || !req.params.clientId)
		return res.sendStatus(403);
	let rid = req.params.resellerId;
	if (rid = 'U')
		rid = req.jwt.resellerId;
	let orders = await orderModel.findByClient(rid, req.params.clientId).catch((error) => {  });
	if (!orders)
		return res.status(200).json([]);
	let statuses = await statusModel.findAll().catch((error) => {  });
	let clients = await clientModel.findByReseller(rid).catch((error) => {  });
	if (!clients)
		return res.status(200).json(orders);
	orders.forEach((order) => {
		let c = clients.filter((obj) => { return obj.id == order.client; })[0];
		if (c)
			order.client_name = c.name;
		let s = statuses.filter((obj) => { return obj.id == order.status; })[0];
		if (s)
			order.status_name = s.value;
	});
	return res.status(200).json(orders);
};

exports.createOrder = async (req, res) => {
	let ret = seperate(req.body);
	return orderModel.create(ret.order).then((result) => {
		if (!result.insertId)
			return res.status(400).json('An error occurred.');
		req.body.id = result.insertId;
		ret.items.forEach(async (item) => {
			if (!item.id)
				item.order_id = result.insertId;
			await itemModel.create(item).catch((error) => { console.log(error); });
		});
		return res.json(req.body);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.updateOrder = async (req, res) => {
	let ret = seperate(req.body);
	return orderModel.update(ret.order).then((result) => {
		ret.items.forEach(async (item) => {
			let a = 'create';
			if (item.id)
				a = 'update';
			if (!item.id)
				item.order_id = ret.order.id;
			await itemModel[a](item).catch((error) => { console.log(error); });
		});
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.deleteOrder = async (req, res) => {
	let orders = await orderModel.findByReseller(req.body.reseller_id).catch((error) => { return res.sendStatus(400); });
	req.body.items.forEach(async (id) => {
		let order = orders.filter((obj) => { return obj.id == id; })[0];
		if (order) {
			order.status = 8;
			await orderModel.update(order).catch((error) => { console.log(error); });
		}
	});
	return res.status(200).json({success: true});
};

function seperate(full) {
	let order = JSON.parse(JSON.stringify(full));
	delete order.items;
	let items = full.items;
	return {order: order, items: items}
}