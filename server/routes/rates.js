const express = require('express')
const router = express.Router()
const { findRateByDevice } = require('../controllers/rates')
const { getRemoteRate } = require('../controllers/rates')
const { findSubcategoryByDevice } = require('../controllers/rates')

router.route('/').post(findRateByDevice)
router.route('/remote').get(getRemoteRate)
router.route('/subcategory').post(findSubcategoryByDevice)

module.exports = router