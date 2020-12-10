const Controller = require('./controllers/clients.controller'),
      statusController = require('./controllers/status.controller'),
      PermissionMiddleware = require('../common/middlewares/auth.permission.middleware'),
			ValidationMiddleware = require('../common/middlewares/auth.validation.middleware'),
      config = require('../common/config/env.config'),
			GOD = config.permissionLevels.GOD,
      SUPER = config.permissionLevels.SUPER,
      ADMIN = config.permissionLevels.ADMIN,
			ALL = 0;

exports.routesConfig = function (app) {
	app.get('/statuses', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    statusController.get
  ]);
	app.get('/client/:clientId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getClientById
  ]);
	app.get('/clients', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getClients
  ]);
	app.get('/clients/:resellerId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(SUPER),
    Controller.getClientsByReseller
  ]);
	app.get('/count/clients', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getClientCount
  ]);
	app.get('/count/client/:resellerId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(SUPER),
    Controller.getClientCount
  ]);
	app.patch('/client', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.updateClient
  ]);
	app.post('/client', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.createClient
  ]);
	app.delete('/client', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.deactivateClient
  ]);
};