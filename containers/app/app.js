import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, userController = require('./controllers/user.cjs')
, userValidator = require('./validators/user.cjs')
, dbConfig = require('./configs/database.cjs')
, hostConfig = require('./configs/host.cjs');

const app = express();
app.use(bodyParser.json());

mongoose.connect(dbConfig.url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

var router = express.Router();
router.put('/:username', [
  userValidator.validateUsername,
  userValidator.validateDateOfBirth
], userController.create);

router.get('/:username', [
  userValidator.validateUsername
], userController.findOne);

app.use('/hello', router)
app.listen(hostConfig.port, hostConfig.hostname);
