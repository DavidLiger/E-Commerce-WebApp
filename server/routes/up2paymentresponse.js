const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

const {
    up2paymentresponse
} = require('../controllers/up2paymentresponse')

router.route('/').post(up2paymentresponse)

module.exports = router