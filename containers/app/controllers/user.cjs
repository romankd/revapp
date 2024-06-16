const UserModel = require('../models/user.cjs')
, util = require('util')
, promConfig = require('../configs/prometheus.cjs')
, app_version = process.env.APP_VERSION;

exports.create = async (req, res) => {
    const username = req.params.username
    const dateOfBirth = new Date(req.body.dateOfBirth)

    const user = new UserModel({
        username: username,
        dateOfBirth: dateOfBirth
    });

    await user.save().then(data => {
        res.status(204).setHeader('Content-Type', 'application/json').send({
            message:"User created successfully!!",
            user:data
        });
    }).catch((error) => {
        console.log(error)
        if (error.code == "11000") {
            console.log("Index dublication error")
            res.status(404).setHeader('Content-Type', 'application/json').json({ message:  "User already exists"}).send();
        } else {
            promConfig
                .custom_metrics
                .uncaught_db_errors_counter
                .inc({ method: req.method, path: req.originalUrl, statusCode: '500', NODE_APP_VERSION: app_version });

            console.log(error)
            res.status(500).setHeader('Content-Type', 'application/json').send();
        }
    });
};

exports.findOne = async (req, res) => {
    const username = req.params.username
    try {
        const user = await UserModel.findOne({username: username});
        
        if (user) {
            res.status(200);
        } else {
            throw new Error("Not found.");
        }

        const bday = new Date(user.dateOfBirth)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const year_today = today.getFullYear()
        var next_bday = new Date(bday.setYear(year_today))
        var diff = 0

        if (next_bday >= today && year_today == next_bday.getFullYear()) {
            if (next_bday.toDateString() === today.toDateString()) {
                res.json({ message: util.format('Hello, %s! Happy birthday!', username)}).send()
                return ;
            }

            diff = next_bday - today
        } else {
            next_bday = new Date(bday.setYear(year_today + 1))
            diff = next_bday - today
        }

        const days = Math.floor(diff / (24*60*60*1000));
        res.json({ message:  util.format('Hello, %s! Your birthday is in %d day(s)', username, days)});
    } catch(error) {
        console.log(error)
        res.status(404).json({ message: error.message});
    }

}