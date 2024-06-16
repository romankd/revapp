var mongoose = require('mongoose');
const promConfig = require('../configs/prometheus.cjs');

exports.metrics = async (req, res, next) => {
    res.setHeader("Content-type", promConfig.promRegister.contentType);
    res.send(await promConfig.promRegister.metrics());
    next();
};