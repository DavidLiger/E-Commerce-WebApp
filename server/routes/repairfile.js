const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// this gonna protect all the route by verifiyng that the user is authenticated
router.use(requireAuth)

const {
    getRepairFile,
    getRepairFiles,
    createRepairFile,
    updateRepairFile
} = require('../controllers/repairfile')

router.route('/').post(createRepairFile).get(getRepairFiles)
router.route('/:id').get(getRepairFile).post(updateRepairFile)

module.exports = router