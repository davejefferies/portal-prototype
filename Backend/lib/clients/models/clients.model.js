const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Clients"
});

var Collection = mysql.Collection.extend({
	tableName: 'Clients',
});

var coll = new Collection();

exports.countByReseller = (id) => {
	return coll.count({where: 'reseller_id = ' + id});
};

exports.findAll = () => {
	return coll.fetch();
};

exports.findByReseller = (id) => {
	return coll.fetch({where: 'reseller_id = ' + id});
};

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = ' + id});
};

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