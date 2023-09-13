const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

const {
    upToPayment
} = require('../controllers/upToPayment')

router.route('/').post(upToPayment)

module.exports = router