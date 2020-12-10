const helpModel = require('../models/help.model'),
      groupModel = require('../models/help-groups.model'),
      crypto = require('crypto');
	
exports.getGroups = (req, res) => {
	return groupModel.findAll().then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getCaq = (req, res) => {
	return helpModel.findCaq().then((result) => {
		result = result.map((obj) => { delete obj.answer; return obj; });
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getByGroup = (req, res) => {
	if (!req.params.id)
		return res.status(200).send([]);
	return helpModel.findByGroup(req.params.id).then((result) => {
		result = result.map((obj) => { delete obj.answer; return obj; });
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.getById = (req, res) => {
	return helpModel.findById(req.params.id).then((result) => {
		return res.status(200).send(result);
	}).catch((error) => {
		return res.status(400).send(error);
	});
};

exports.newItem = async (req, res) => {
	let cp = 0;
	if (req.body.caq)
		cp = await getCaqPriority();
	let p = await getPriority(req.body.group_id);
	req.body.priority = p;
	req.body.caq_priority = cp;
	return helpModel.createHelp(req.body).then((result) => {
		if (!result.insertId)
			return res.status(400).json('An error occurred.');
		req.body.id = result.insertId;
		return res.json(req.body);
	}).catch((error) => {
		return res.status(400).json(error);
	});
};

exports.update = (req, res) => {
	if (req.body instanceof Array) {
		req.body.forEach(async (item) => {
			await updateItem(item);
		});
		return res.status(200).send('Success');
	} else {
		console.log(req.body);
		return helpModel.updateItem(req.body).then((result) => {
			return res.status(200).send(result);
		}).catch((error) => {
			return res.status(400).send(error);
		});
	}
};

exports.updateCaq = (req, res) => {
	let l = 0;
	req.body.sort((a, b) => { return a.caq_priority - b.caq_priority; }).forEach(async (item) => {
		if (item.caq_priority == 1000000)
			item.caq_priority = l + 1;
		l = item.caq_priority;
		await updateItem(item);
	});
	return res.json(req.body);
};

exports.deleteItem = async (req, res) => {
  let item = await helpModel.findById(req.params.id);
	if (!item)
	  return res.sendStatus(400);
	let items = await helpModel.findByGroup(item.group_id);
	let array = [];
	items.sort((a, b) => { return a.priority - b.priority; }).forEach(async (question) => {
		if (question.id == item.id) {
			await helpModel.deleteItem(question.id);
	  } else if (question.priority > item.priority) {
			question.priority = question.priority - 1;
			array.push({id: question.id, priority: question.priority});
			await updateItem(question);
		}
	});
	return res.json(array);
};

function updateItem(item) {
	return new Promise(resolve => {
		return helpModel.updateItem(item).then((result) => {
			return resolve(result);
		}).catch((error) => {
			return resolve(error);
		});
	});
}

function getCaqPriority() {
	return new Promise(resolve => {
		return helpModel.findCaq().then((result) => {
			if (!result)
				return resolve(0);
			else if (result.length == 0)
				return resolve(1);
			result = result.sort((a, b) => { return a.caq_priority - b.caq_priority; });
			return resolve(result[result.length - 1].caq_priority + 1);
		}).catch((error) => {
			return resolve(0);
		});
	});
}

function getPriority(id) {
	return new Promise(resolve => {
		return helpModel.findByGroup(id).then((result) => {
			console.log(result);
			if (!result)
				return resolve(0);
			else if (result.length == 0)
				return resolve(1);
			result = result.sort((a, b) => { return a.priority - b.priority; });
			return resolve(result[result.length - 1].priority + 1);
		}).catch((error) => {
			return resolve(0);
		});
	});
}