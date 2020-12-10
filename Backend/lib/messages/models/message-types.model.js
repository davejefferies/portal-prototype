const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "MessageTypes"
});

var Collection = mysql.Collection.extend({
	tableName: 'MessageTypes',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}