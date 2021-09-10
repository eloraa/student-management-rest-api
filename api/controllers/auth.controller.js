const User = require('../models/user.model')
const httpStatus = require('http-status')

exports.register = async (req, res, next) => {
    try {
        const userData = {
            name: req.body.name,
            class: req.body.class,
            roll: req.body.roll,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        const user = await new User(userData).save();
        const userTransformed = user.transform();
        res.status(httpStatus.CREATED);
        return res.json({ user: userTransformed });
    } catch (error) {
        return next(error);
    }
  };
 