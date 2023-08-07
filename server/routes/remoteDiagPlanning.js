const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    getRemoteDiagPlanning,
    getDiagsByMonth
} = require('../controllers/remoteDiagPlanning')

const {
    getRepairFilesById
} = require('../controllers/repairfile')

router.route('/').post(getRemoteDiagPlanning)
router.route('/:month/:year').get(getDiagsByMonth)

module.exports = router