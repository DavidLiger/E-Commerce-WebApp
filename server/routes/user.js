const express = require('express')
const router = express.Router()
const { signupUser, loginUser, verifyUser, renewPassword, changePassword } = require('../controllers/user')

router.route('/login').post(loginUser)
router.route('/signup').post(signupUser)
router.route('/verify').post(verifyUser)
router.route('/renewPassword').post(renewPassword)
router.route('/changePassword').post(changePassword)

module.exports = router