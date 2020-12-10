const Controller = require('./controllers/users.controller'),
      PermissionMiddleware = require('../common/middlewares/auth.permission.middleware'),
			ValidationMiddleware = require('../common/middlewares/auth.validation.middleware'),
      config = require('../common/config/env.config'),
			GOD = config.permissionLevels.GOD,
      SUPER = config.permissionLevels.SUPER,
      ADMIN = config.permissionLevels.ADMIN,
			ALL = 0;

exports.routesConfig = function (app) {
	app.get('/my-info', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getByToken
  ]);
	app.get('/permissions', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getPermissions
  ]);
	app.get('/user/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getUserById
  ]);
	app.get('/users', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getUsers
  ]);
	app.get('/users/:resellerId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(SUPER),
    Controller.getUsersByReseller
  ]);
	app.patch('/user', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.updateUser
  ]);
	app.post('/user', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.createUser
  ]);
	app.delete('/user', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.deleteUser
  ]);
};