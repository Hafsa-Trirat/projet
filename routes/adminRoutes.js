const { Admin } = require('mongodb');
const { recupererThemes, recupererThemeswithSupervisor, LogInAdmin } = require('../controllers/admincontroller');
const authMiddleware1 = require('../middlewares/authMiddleware')
const express = require('express');
const router = express.Router()


router.post('/afficherThemes', recupererThemes);
router.post('/afficherThemesAvecSupervisor',  recupererThemeswithSupervisor);




//router.post('/loginAdmin', [authMiddleware1.authMiddleware, authMiddleware1.authRole("admin")], LogInAdmin);




router.post('/loginAdmin', LogInAdmin);
module.exports = router;
