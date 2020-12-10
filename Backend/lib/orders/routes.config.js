const Controller = require('./controllers/orders.controller'),
      PermissionMiddleware = require('../common/middlewares/auth.permission.middleware'),
			ValidationMiddleware = require('../common/middlewares/auth.validation.middleware'),
      config = require('../common/config/env.config'),
			GOD = config.permissionLevels.GOD,
      SUPER = config.permissionLevels.SUPER,
      ADMIN = config.permissionLevels.ADMIN,
			ALL = 0;

exports.routesConfig = function (app) {
	app.get('/order/types', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getTypes
  ]);
	app.get('/order/status', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getStatuses
  ]);
	app.get('/order/:id', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getOrder
  ]);
	app.get('/orders', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getOrders
  ]);
	app.get('/orders/:resellerId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(SUPER),
    Controller.getOrderByReseller
  ]);
	app.get('/orders/:resellerId/:clientId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.getOrderByClient
  ]);
	app.patch('/order', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.updateOrder
  ]);
	app.post('/order', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.createOrder
  ]);
	app.delete('/order', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ALL),
    Controller.deleteOrder
  ]);
};