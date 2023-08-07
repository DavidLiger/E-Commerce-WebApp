const express = require('express')
const router = express.Router()
const { getAgencies } = require('../controllers/agencies')

router.route('/').get(getAgencies)

module.exports = router