const util = require('util');

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;
const db_port = process.env.DB_PORT;

const mongoconnecturl = util.format('mongodb://%s:%s@%s:%s/%s:27017', db_user, db_password, db_host, db_port, db_name);

module.exports = {
    url: mongoconnecturl
}