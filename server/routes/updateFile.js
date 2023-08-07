const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    updateFile
} = require('../controllers/updateFile')

router.route('/').post(updateFile)

module.exports = router