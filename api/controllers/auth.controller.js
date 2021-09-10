const User = require('../models/user.model')
const httpStatus = require('http-status')
const moment = require('moment-timezone');
const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const {
  omit
} = require('lodash')


function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const error = await User.validateRoll(userData);
    if (!error) {
      const user = await new User(userData).save();
      const userTransformed = user.transform();
      const token = generateTokenResponse(user, user.token());
      res.status(httpStatus.CREATED);
      return res.json({
        token,
        user: userTransformed
      });
    }
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};