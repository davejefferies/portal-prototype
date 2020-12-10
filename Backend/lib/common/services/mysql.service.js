var MysqlModel = require('../models/mysql.model');
var MysqlCollection = require('../collections/mysql.collection');

exports.mysql = {
	Model: MysqlModel,
	Collection: MysqlCollection
};