const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    deleteImg,
    moveImg,
    getImg
} = require('../controllers/manageImg')

router.route('/:name').delete(deleteImg)
router.route('/').post(moveImg).get(getImg)

module.exports = router