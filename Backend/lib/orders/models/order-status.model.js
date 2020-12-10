const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "OrderStatus"
});

var Collection = mysql.Collection.extend({
	tableName: 'OrderStatus',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}