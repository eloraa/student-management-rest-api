const User = require('../models/user.model')
const {
  omit
} = require('lodash');

exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = {
      user
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.find();
    const transformedUsers = users.map((user) => user.transform());

    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
}

exports.get = (req, res) => {
  res.json(req.locals.user.transform())
}

exports.loggedIn = (req, res) => res.json(req.user.transform());

exports.replace = async (req, res, next) => {
  try {
    const {
      user
    } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, {
      override: true,
      upsert: true
    });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};