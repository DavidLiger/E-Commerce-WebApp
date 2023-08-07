const express = require('express')
const router = express.Router()
const { getAdvices } = require('../controllers/advices')

router.route('/:id').get(getAdvices)

module.exports = router