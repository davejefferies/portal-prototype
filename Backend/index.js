const config = require('./lib/common/config/env.config.js');
      express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      multer = require('multer'),
			cors = require('cors'),
      upload = multer(),
      authorizationRouter = require('./lib/authorization/routes.config'),
			clientsRouter = require('./lib/clients/routes.config'),
			helpRouter = require('./lib/help/routes.config'),
			messagesRouter = require('./lib/messages/routes.config'),
			ordersRouter = require('./lib/orders/routes.config'),
			resellersRouter = require('./lib/resellers/routes.config'),
			usersRouter = require('./lib/users/routes.config');
			
var router = express.Router();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS')
    return res.sendStatus(200);
  else
    return next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());

authorizationRouter.routesConfig(router);
clientsRouter.routesConfig(router);
helpRouter.routesConfig(router);
messagesRouter.routesConfig(router);
ordersRouter.routesConfig(router);
resellersRouter.routesConfig(router);
usersRouter.routesConfig(router);

app.use('/api/v1', router);

app.listen(config.port, function () {
  console.log('app listening at port %s', config.port);
});