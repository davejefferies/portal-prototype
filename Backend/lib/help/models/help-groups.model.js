const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "HelpGroups"
});

var Collection = mysql.Collection.extend({
	tableName: 'HelpGroups',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}