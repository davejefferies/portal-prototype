var Backbone = require('backbone');
var Promise = require("bluebird");
var mysql = require("mysql");

var MysqlModel = Backbone.Model.extend({
	pool: function() {
		return mysql.createPool({
			connectionLimit : 500,
			host            : 'localhost',
			user            : 'root',
			password        : 'Aqwe123@!',
			database        : 'reseller'
		})
	},
	fetch: function (id, fields) {
		var self = this;
		fields = fields || '*';
		id = id || self.id || self.attributes[self.idAttribute];
		
		return new Promise(function(resolve, reject) {
			if (!id) reject(new Error('mysql-model: No id passed or set'));
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var q = "SELECT " + fields + " FROM " + self.tableName + " WHERE " + self.idAttribute + "=" + id;
				connection.query(q, function (err, result, fields) {
					connection.destroy();
					if (err || !result) 
						reject(err);
					else {
						self.set(result[0]);
						resolve(self);
					}
				});
			});
		});
	},
	save: function (id) {
		var self = this;
		id = id || self.id || self.attributes[self.idAttribute];
		return new Promise(function (resolve, reject) {
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				if (!id) {
					var query = "INSERT INTO " + self.tableName + " SET " + connection.escape(self.attributes);
					connection.query(query, function (err, results, fields) {
						connection.destroy();
						if (err) reject(err);
						else if (!results.insertId) reject(new Error('mysql-model: No row inserted.'));
						else {
							self.set(self.idAttribute, results.insertId);
							resolve(results);
						}
					})				
				} else {
					var query = "UPDATE " + self.tableName + " SET " + connection.escape(self.attributes) + " WHERE " + self.idAttribute + "=" + connection.escape(id);
					connection.query(query, function (err, results, fields) {
						connection.destroy();
						if (err) reject(err);
						//else if (!results.changedRows) reject(new Error('mysql-model: No rows changed.'));
						else resolve(results);
					})
				}
			});
		});
	},	
	destroy: function (id) {
		var self = this;
		id = id || self.id || self.attributes[self.idAttribute];
		return new Promise(function (resolve, reject) {
			if (!id) reject(new Error('mysql-model: No id passed or set'));
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var query = "DELETE FROM " + self.tableName + " WHERE " +self.idAttribute+ "=" + connection.escape(id);
				connection.query(query, function (err, results) {
					connection.destroy();
					if (err) reject(err);
					else if (!results.affectedRows) reject(new Error('mysql-model: No rows removed.'));
					else {
						self.clear();
						resolve(results);
					}
				});
			});
		});
	}
});

module.exports = MysqlModel;