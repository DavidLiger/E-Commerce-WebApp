const express = require('express')
const router = express.Router()
const { getDeptsName } = require('../controllers/ratezone')

router.route('/').get(getDeptsName)

module.exports = router