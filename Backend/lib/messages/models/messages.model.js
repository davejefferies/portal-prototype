const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Messages"
});

var Collection = mysql.Collection.extend({
	tableName: 'Messages',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = "' + id + '"'});
}

exports.findCount = (type) => {
	return coll.count({where: 'status = 2 AND type = ' + type});
}

exports.createMessage = (data) => {
	const model = new Model(data);
	return model.save();
};