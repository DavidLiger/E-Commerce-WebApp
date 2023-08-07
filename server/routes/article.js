const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    createArticle,
    updateArticle,
    deleteArticle
} = require('../controllers/article')


router.route('/').post(createArticle)
router.route('/:id').put(updateArticle).delete(deleteArticle)

module.exports = router