const express = require('express')
const router = express.Router()

const {
    getBlogImg
} = require('../controllers/manageImg')

router.route('/').post(getBlogImg)

module.exports = router