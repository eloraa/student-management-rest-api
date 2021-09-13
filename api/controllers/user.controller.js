const User = require('../models/user.model')

exports.load = async (req, res, next, id) => {
    try {
      const user = await User.get(id);
      req.locals = { user };
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