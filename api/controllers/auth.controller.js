const User = require('../models/user.model')
const httpStatus = require('http-status')
const {
  omit
} = require('lodash')

exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const error = await User.validateRoll(userData);
    if(!error) {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(httpStatus.CREATED);
      res.json(savedUser.transform());
    }
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};