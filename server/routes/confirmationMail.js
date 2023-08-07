const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

const {
    sendConfirmationMail
} = require('../controllers/confirmationMail')

router.route('/').post(sendConfirmationMail)

module.exports = router