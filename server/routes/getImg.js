const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    getImg
} = require('../controllers/manageImg')

router.route('/').post(getImg)

module.exports = router