const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    getRepairFilesById
} = require('../controllers/repairfile')

router.route('/:id').get(getRepairFilesById)

module.exports = router