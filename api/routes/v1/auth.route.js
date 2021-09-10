const express = require('express');
const validate = require('express-validation')
const controller = require('../../controllers/auth.controller');

const { register } = require('../../validations/auth.validation')

const router = express.Router();



router
    .route('/register')

    .post(validate(register), controller.register)


module.exports = router;
