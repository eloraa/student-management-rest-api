const express = require('express');
const validate = require('express-validation')
const controller = require('../../controllers/auth.controller');

const { register, login } = require('../../validations/auth.validation')

const router = express.Router();



router
    .route('/register')

    .post(validate(register), controller.register)

router
    .route('/login')

    .post(validate(login), controller.login)


module.exports = router;
