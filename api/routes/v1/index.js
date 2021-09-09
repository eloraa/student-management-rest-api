const express = require('express')
const router = express.Router()
const userRoutes = './user.route'

router.get('/status', (re1, res) => res.send('OK'))

router.use('/users', userRoutes)

module.exports = router;