const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router
  .param('userId', controller.load)

router
  .route('/')

  .get(controller.list)


router
    .route('/:userId')

    .get(controller.get)


module.exports = router;
