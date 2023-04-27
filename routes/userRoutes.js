const express = require('express')

const router = express.Router()
const  authMiddleware  = require('../middlewares/authMiddleware');

const { SignUp,
    ForgotPassword,
    ResetPassword,
    LogIn,
    LogOut,
    ModifyAccount,
    GetUserProfile

} = require('../controllers/userController')

router.post('/SignUp', SignUp)
router.post('/ForgotPassword', ForgotPassword)
router.put('/ResetPassword', ResetPassword)
router.post('/LogLn',authMiddleware, LogIn)
router.post('/LogOut', authMiddleware, LogOut)
router.post('/ModifyAccount', ModifyAccount)
router.get('/GetUserProfile', GetUserProfile)


module.exports = router