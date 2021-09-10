const express = require('express');
const controller = require('../../controllers/user.controller');

const router = express.Router();


router
  .route('/')

  .get(controller.getStudentList)


router
    .route('/:id')

    .get(controller.getStudent)


module.exports = router;
