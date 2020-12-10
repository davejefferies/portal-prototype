const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Help"
});

var Collection = mysql.Collection.extend({
	tableName: 'Help',
});

var coll = new Collection();

exports.findCaq = () => {
	return coll.fetch({where: 'caq = 1'});
}

exports.findByGroup = (id) => {
	return coll.fetch({'where': 'group_id = ' + id});
}

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = ' + id});
}

exports.createHelp = (data) => {
	const model = new Model(data);
	return model.save();
};

exports.updateItem = (data) => {
	return new Promise((resolve, reject) => {
		const model = new Model();
		return model.fetch(data.id).then((item) => {
			Object.keys(data).forEach((key) => {
				item.set(key, data[key]);
			});
			return item.save().then((result) => {
				return resolve(result);
			}).catch((error) => {
				return reject(error);
			});
		}).catch((error) => {
			return reject(error);
		});
	});
};

exports.deleteItem = (id) => {
	return new Promise((resolve, reject) => {
		const model = new Model();
		return model.destroy(id).then((result) => {
			return resolve(result);
		}).catch((error) => {
			return reject(error);
		});
	});
};