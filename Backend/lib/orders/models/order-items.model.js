const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "OrderItems"
});

var Collection = mysql.Collection.extend({
	tableName: 'OrderItems',
});

var coll = new Collection();

exports.findByOrder = (id) => {
	return coll.fetch({'where': 'order_id = ' + id});
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