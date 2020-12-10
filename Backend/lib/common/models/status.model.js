const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Status"
});

var Collection = mysql.Collection.extend({
	tableName: 'Status',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch({'order': 'id'});
}

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = "' + id + '"'});
}