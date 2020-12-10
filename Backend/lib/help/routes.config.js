const Controller = require('./controllers/help.controller'),
      PermissionMiddleware = require('../common/middlewares/auth.permission.middleware'),
			ValidationMiddleware = require('../common/middlewares/auth.validation.middleware'),
      config = require('../common/config/env.config'),
			GOD = config.permissionLevels.GOD,
      SUPER = config.permissionLevels.SUPER,
      ADMIN = config.permissionLevels.ADMIN,
			ALL = 0;

exports.routesConfig = function (app) {
	app.get('/helps/groups', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getGroups
  ]);
	app.get('/helps/caq', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getCaq
  ]);
	app.get('/helps/group/:id', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getByGroup
  ]);
	app.get('/help/:id', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getById
  ]);
	app.patch('/help/update', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.update
  ]);
	app.patch('/help/update/caq', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.updateCaq
  ]);
	app.post('/help/new', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.newItem
  ]);
	app.delete('/help/:id', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.deleteItem
  ]);
};