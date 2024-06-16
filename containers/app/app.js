import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, userController = require('./controllers/user.cjs')
, probeController = require('./controllers/probe.cjs')
, promehtusController = require('./controllers/prometheus.cjs')
, userValidator = require('./validators/user.cjs')
, dbConfig = require('./configs/database.cjs')
, hostConfig = require('./configs/host.cjs')
, promConfig = require('./configs/prometheus.cjs');

const app = express();
app.use(bodyParser.json());

mongoose.connect(dbConfig.url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

var app_router = express.Router();
app_router.put('/:username', [
  userValidator.validateUsername,
  userValidator.validateDateOfBirth
], userController.create);

app_router.get('/:username', [
  userValidator.validateUsername
], userController.findOne);

var router_checks = express.Router();
router_checks.get('/health', probeController.checkUp);
router_checks.get('/ready', probeController.checkUp);


var prometheus_router = express.Router();
prometheus_router.get('/metrics', promehtusController.metrics);

app.use('/hello', app_router);
app.use('/prometheus', prometheus_router);
app.use('/', router_checks);
app.listen(hostConfig.port, hostConfig.hostname);
