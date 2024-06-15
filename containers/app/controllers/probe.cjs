var mongoose = require('mongoose');
const db_name = process.env.DB_NAME;

exports.checkUp = async (req, res) => {
    if (!mongoose.connection.readyState) {
        res.status(500).setHeader('Content-Type', 'application/json').send()
    }

    res.status(200).setHeader('Content-Type', 'application/json').send({
        healthy: true,
        status: 'UP'
    });
};
