const express = require('express')
const router = express.Router()

const {
    getArticles,
} = require('../controllers/article')


router.route('/').get(getArticles)

module.exports = router