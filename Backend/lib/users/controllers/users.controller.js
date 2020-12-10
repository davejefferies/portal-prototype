const userModel = require('../models/users.model'),
      resellerModel = require('../../resellers/models/resellers.model'),
			permissionModel = require('../../common/models/permissions.model'),
      crypto = require('crypto');
			
exports.getByToken = (req, res) => {
	if (!req.jwt || !req.jwt.userId)
		return res.sendStatus(403);
	return userModel.findById(req.jwt.userId).then((result) => {
		delete result.password;
		if (!result.reseller_id)
			return res.status(200).send(result);
		return resellerModel.findById(result.reseller_id).then((r) => {
			result.reseller = r;
			return res.status(200).send(result);
		}).catch((error) => {
			return res.status(200).send(result);
		});
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getPermissions = async (req, res) => {
	permissionModel.findAll().then((result) => {
		return res.status(200).json(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.getUsers = async (req, res) => {
	if (!req.jwt.resellerId)
		return res.status(400).json('No Reseller is assigned to you.');
	let users = await userModel.findByReseller(req.jwt.resellerId).catch((error) => {  });
	if (!users)
		return res.status(200).json([]);
	let permissions = await permissionModel.findAll().catch((error) => {  });
	if (!permissions)
		return res.status(200).json(users.map((obj) => { let o = JSON.parse(JSON.stringify(obj)); delete o.password; return o; }));
	users.forEach((user) => {
		let p = permissions.filter((obj) => { return obj.value == user.permissionLevel; })[0];
		if (p)
			user.role = p.name;
	});
	return res.status(200).json(users.map((obj) => { let o = JSON.parse(JSON.stringify(obj)); delete o.password; return o; }));
};

exports.getUsersByReseller = async (req, res) => {
	if (!req.params.resellerId)
		return res.sendStatus(403);
	let users = await userModel.findByReseller(req.params.resellerId).catch((error) => {  });
	if (!users)
		return res.status(200).json([]);
	let permissions = await permissionModel.findAll().catch((error) => {  });
	if (!permissions)
		return res.status(200).json(users.map((obj) => { let o = JSON.parse(JSON.stringify(obj)); delete o.password; return o; }));
	users.forEach((user) => {
		let p = permissions.filter((obj) => { return obj.value == user.permissionLevel; })[0];
		if (p)
			user.role = p.name;
	});
	return res.status(200).json(users.map((obj) => { let o = JSON.parse(JSON.stringify(obj)); delete o.password; return o; }));
};

exports.getUserById = (req, res) => {
	return userModel.findById(req.params.userId).then((result) => {
		if (!result)
			return res.status(200).send([]);
		delete result.password;
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.createUser = (req, res) => {
	let user = getUserObject(req.body);
	return userModel.create(user).then((result) => {
		if (!result.insertId)
			return res.status(400).json('An error occurred.');
		req.body.id = result.insertId;
		return res.json(req.body);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.updateUser = (req, res) => {
	let user = getUserObject(req.body);
	return userModel.update(user).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.deleteUser = async (req, res) => {
	let users = await userModel.findByReseller(req.body.reseller_id).catch((error) => { return res.sendStatus(400); });
	let array = [];
	req.body.items.forEach(async (id) => {
		let user = users.filter((obj) => { return obj.id == id; })[0];
		if (user) {
			array.push(user.id);
		}
	});
	return userModel.delete(array).then((result) => {
		return res.status(200).json(result);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

function getUserObject(oldObj) {
	let user = {
		id: oldObj.id,
		firstName: oldObj.firstName,
		lastName: oldObj.lastName,
		email: oldObj.email,
		permissionLevel: oldObj.permissionLevel,
		reseller_id: oldObj.reseller_id
	};
	if (oldObj.password) {
		let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(oldObj.password).digest("base64");
    user.password = salt + "$" + hash;
	}
	return user;
}