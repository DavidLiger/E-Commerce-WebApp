const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)

const {
    transferFile
} = require('../controllers/transferFile')

router.route('/').post(transferFile)

module.exports = router