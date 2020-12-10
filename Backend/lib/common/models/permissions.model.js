const mysql = require('../../common/services/mysql.service').mysql;

var Model = mysql.Model.extend({
	tableName: "Permissions"
});

var Collection = mysql.Collection.extend({
	tableName: 'Permissions',
});

var coll = new Collection();

exports.findAll = () => {
	return coll.fetch();
}

exports.findById = (id) => {
	return coll.fetchOne({'where': 'id = "' + id + '"'});
}

exports.findByRoleGroup = (role, group) => {
  return coll.fetch({left: 'PermissionEntity ON PermissionEntity.id = Permissions.eid', where: 'rid = ' + role});
}