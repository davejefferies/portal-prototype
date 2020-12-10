const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "OrderTypes"
});

var Collection = mysql.Collection.extend({
	tableName: 'OrderTypes',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}