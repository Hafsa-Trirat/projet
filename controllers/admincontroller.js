
const Topic = require('../models/Topic')
const authMiddleware1 = require('../middlewares/authMiddleware')
const User = require('../models/User')
require('body-parser')
const bcrypt = require('bcryptjs')



const asyncHandler = require('express-async-handler')

// Fonction pour récupérer tous les thèmes de mémoire
exports.recupererThemes = async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json({ topics });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer les thèmes', error });
    }
};

// Fonction pour récupérer tous les thèmes de mémoire
exports.recupererThemes = async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json({ topics });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer les thèmes', error });
    }
};

exports.recupererThemeswithSupervisor = async (req, res) => {
    try {
        const topics = await Topic.find().populate({ path: 'supervisor', select: 'nom prenom' });
        res.status(200).json({ topics });
    } catch (error) {
        res.status(400).json({ message: 'Impossible de récupérer les thèmes', error });
    }
};

exports.LogInAdmin = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const user = await User.findOne({ email })



    const matchPassword = await bcrypt.compare(password, user.password);
    if (user && (matchPassword)) {
        if (user.role != "admin") {
            res.status(401)
            res.json({ message: "permission denied" })
        }
        res.status(200)
        res.json({
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            numero_telephone: user.numero_telephone,
            isitStudent: user.isitStudent,
            notifications: user.notifications,
            grade: user.grade,
            specialite: user.specialite,
            token: user.generateJWT()
        })
    } else {
        next(new ErrorResponse('Invalid email or password', 400))
    }
})

