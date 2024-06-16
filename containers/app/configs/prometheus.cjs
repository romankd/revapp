client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register, labels: { NODE_APP_VERSION: process.env.APP_VERSION } });

const uncaught_db_errors_counter = new client.Counter({
    name: 'uncaught_database_errors',
    help: 'number_of_errors_on_database_connection',
    type: 'counter',
    labelNames: [ "method", "statusCode", "path", "NODE_APP_VERSION" ]
});

register.registerMetric(uncaught_db_errors_counter)

module.exports = { 
    promClient: client, 
    promRegister: register,
    custom_metrics: { 
        uncaught_db_errors_counter: uncaught_db_errors_counter
     }
}