const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Users"
});

var Collection = mysql.Collection.extend({
	tableName: 'Users',
});

var coll = new Collection();

exports.findByReseller = (id) => {
	return coll.fetch({'where': 'permissionLevel != 12000 AND reseller_id = ' + id});
}

exports.findByPermission = (perm) => {
	return coll.fetch({'where': 'permissionLevel >= ' + perm});
}

exports.findByEmail = (email) => {
	return coll.fetch({'where': 'email = "' + email + '"'});
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

exports.delete = (data) => {
	return new Promise((resolve, reject) => {
		const model = new Model();
		return model.destroy(data).then((result) => {
			return resolve(result);
		}).catch((error) => {
			return reject(error);
		});
	});
};