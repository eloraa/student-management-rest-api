const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();

router
  .param('userId', controller.load)

router
  .route('/')

  .get(controller.getStudentList)


router
    .route('/:userId')

    .get(controller.getStudent)


module.exports = router;
