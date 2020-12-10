const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "MessageSent"
});

var Collection = mysql.Collection.extend({
	tableName: 'MessageSent',
});

var coll = new Collection();

