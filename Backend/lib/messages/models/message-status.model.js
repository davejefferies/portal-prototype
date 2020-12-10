const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "MessageStatus"
});

var Collection = mysql.Collection.extend({
	tableName: 'MessageStatus',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}