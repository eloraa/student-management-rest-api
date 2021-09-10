const User = require('../models/user.model')
const httpStatus = require('http-status')
const {
  omit
} = require('lodash')

exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const error = await User.validateRoll(userData);
    if (!error) {
      const user = await new User(userData).save();
      const userTransformed = user.transform();
      res.status(httpStatus.CREATED);
      return res.json({
        user: userTransformed
      });
    }
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};