const Controller = require('./controllers/messages.controller'),
      PermissionMiddleware = require('../common/middlewares/auth.permission.middleware'),
			ValidationMiddleware = require('../common/middlewares/auth.validation.middleware'),
      config = require('../common/config/env.config'),
			GOD = config.permissionLevels.GOD,
      SUPER = config.permissionLevels.SUPER,
      ADMIN = config.permissionLevels.ADMIN,
			ALL = 0;

exports.routesConfig = function (app) {
	app.get('/message/statuses', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getStatuses
  ]);
	app.get('/message/types', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getTypes
  ]);
	app.get('/messages', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(SUPER),
    Controller.getAll
  ]);
	app.get('/messages/:resellerId/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getByUser
  ]);
	app.get('/message/:id', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getById
  ]);
	app.get('/count/messages', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getMessageCount
  ]);
	app.get('/count/alerts', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getAlertCount
  ]);
};