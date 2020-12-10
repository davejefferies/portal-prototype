var Backbone = require('backbone');
var Promise = require("bluebird");
var _ = require("underscore");
var MysqlModel = require("../models/mysql.model.js");
var mysql = require('mysql');

var MysqlCollection = Backbone.Collection.extend({
	model: MysqlModel,
	pool: function() {
		return mysql.createPool({
			connectionLimit : 500,
			host            : 'localhost',
			user            : 'root',
			password        : 'Aqwe123@!',
			database        : 'reseller'
		})
	},
	create: function (data) {
		var self = this;
		var tableName = self.model.prototype.tableName || self.tableName;
		var idAttribute = self.model.prototype.idAttribute || self.idAttribute || 'id';
		return new Promise(function (resolve, reject) {
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var query = "INSERT INTO " + tableName + " SET " + connection.escape(data);
				connection.query(query, function (err, results, fields) {
					connection.destroy();
					if (err) reject(err);
					else if (!results.insertId) reject(new Error('mysql-model: No row inserted.'));
					else {
						data[idAttribute] = results.insertId;
						self.add(data);
						resolve(data);
					}
				});
			});
		});
	},	
	destroy: function (models) {
		var self = this;
		var tableName = self.tableName;
		var idAttribute = self.model.prototype.idAttribute || self.idAttribute || 'id';
		if (typeof models === 'string' || typeof models === 'number') {
			var model = new self.model();
			self.remove(models);
			return model.destroy(models);
		} else if (self._isModel(models) && models.has(idAttribute)) {
			self.remove(models);
			return models.destroy();
		}
		return new Promise(function (resolve, reject) {
			if (Object.prototype.toString.call(models) != '[object Array]')
				return reject(new Error('mysql-model: Invalid argument, pass models.'));
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var ids = _.map(models, function(model) {
					return model[idAttribute] || model;
				});
				var query = "DELETE from " + tableName + " WHERE " + idAttribute + " IN (" + self.connection.escape(ids) + ");"
				connection.query(query, function (err, results) {
					connection.destroy();
					if (err) reject(err);
					else if (!results.affectedRows) reject(new Error('mysql-model: No rows removed.'));
					else {
						self.remove(ids);
						resolve(results);
					}
				});
			});
		});
	},
	count: function (conditions) {
		var self = this;
		var tableName = self.tableName;
		var parsed = self._parseConditions(conditions);
		return new Promise(function (resolve, reject) {
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var q = "SELECT COUNT(*) FROM " + tableName + parsed.query;
				connection.query(q, function (err, result, fields) {
					connection.destroy();
					if (err || !result) reject(err);
					else resolve(result[0]['COUNT(*)']);
				});
			});
		});
	},
	fetch: function (conditions) {
		var self = this;
		var tableName = self.tableName;
		var parsed = self._parseConditions(conditions);
		return new Promise(function (resolve, reject) {
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var q = "SELECT " + parsed.fields + " FROM " + tableName + parsed.query;
				console.log(q);
				connection.query(q, function (err, result, fields) {
					connection.destroy();
					if (err || !result) 
						reject(err);
					else {
						self.set(result);
						resolve(result);
					}
				});
			});
		});
	},
	fetchOne: function (conditions) {
		var self = this;
		var tableName = self.tableName;
		var parsed = self._parseConditions(conditions);
		return new Promise(function (resolve, reject) {
			self.pool().getConnection((err, connection) => {
				if (err)
					return reject('No Connection');
				var q = "SELECT " + parsed.fields + " FROM " + tableName + parsed.query;
				connection.query(q, function (err, result, fields) {
					connection.destroy();
					if (err || !result) 
						reject(err);
					else {
						let res;
						if (result.length > 0)
							res = result[0];
						else
							res = {};
						self.set(res);
						resolve(res);
					}
				});
			});
		});
	},
	_parseConditions: function (conditions) {
		var self = this;
		var query = '';
		var fields = self.tableName + '.*';
		if (conditions) {
			if (conditions.fields)
				fields = conditions.fields;
			if (conditions.left)
			  query += " LEFT JOIN " + conditions.left;
			if (conditions.where)  
				query += " WHERE " + conditions.where;
			if (conditions.group) {
				query += " GROUP BY " + conditions.group;
				if (conditions.groupDESC) 
					query += " DESC";
			}
			if (conditions.having) 
				query += " HAVING " + conditions.having;
			if (conditions.order) {
				query += " ORDER BY " + conditions.order;
				if (conditions.orderDESC) 
					query += " DESC";
			}
			if (conditions.limit) 
				query += " LIMIT " + conditions.limit;
		}
		return {
			fields: fields,
			query: query
		}
	}
});


module.exports = MysqlCollection;