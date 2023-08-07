const express = require('express')
const router = express.Router()
const { getRatezone } = require('../controllers/ratezone')

router.route('/:dpt').get(getRatezone)

module.exports = router