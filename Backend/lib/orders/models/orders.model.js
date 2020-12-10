const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Orders"
});

var Collection = mysql.Collection.extend({
	tableName: 'Orders',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}

exports.findByClient = (resellerId, clientId) => {
	return coll.fetch({'where': 'status != 8 AND reseller_id = ' + resellerId + ' AND client = ' + clientId});
}

exports.findByReseller = (id) => {
	return coll.fetch({'where': 'status != 8 AND reseller_id = ' + id});
}

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = "' + id + '"'});
}

exports.create = (data) => {
	const model = new Model(data);
	return model.save();
};

exports.update = (data) => {
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