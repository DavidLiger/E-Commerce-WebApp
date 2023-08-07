const express = require('express')
const router = express.Router()
const { getDevices } = require('../controllers/devices')

router.route('/').get(getDevices)

module.exports = router