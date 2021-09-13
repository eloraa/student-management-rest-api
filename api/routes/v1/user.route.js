const express = require('express');
const controller = require('../../controllers/user.controller');
const validate = require('express-validation')
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  replaceUser
} = require('../../validations/user.validation');

const router = express.Router();

router
  .param('userId', controller.load)

router
  .route('/')

  .get(authorize(ADMIN), controller.list)

router
  .route('/profile')

  .get(authorize(), controller.loggedIn)

router
    .route('/:userId')

    .get(authorize(LOGGED_USER), controller.get)
  
    .put(authorize(LOGGED_USER), validate(replaceUser), controller.replace)



module.exports = router;
