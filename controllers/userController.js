const crypto = require('crypto')
require('body-parser')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/ErrorResponse')
const sendEmail = require('../utils/sendEmail')

// @desc     Register user
// @route    POST /api/users/SignUp
// @access   Public
exports.SignUp = async (req, res, next) => {
  const { nom, prenom, email, password, role, numero_telephone, isitStudent, grade, specialite } = req.body;
  let supervisors = ['y_kouadri@univ-setif2.dz', 'b_belguidoum@univ-setif2.dz', 's_houas@univ-setif2.dz'];
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      next(new ErrorResponse('L\'adresse e-mail existe déjà', 409))
    }
    //validate email
    const allowedDomains = ['univ-setif2.dz']
    const domain = email.split('@')[1].toLowerCase();

    if (!allowedDomains.includes(domain)) {
      next(new ErrorResponse('Domaine non autorisé pour l\'inscription', 400))
    }
    // Create the user
    let user;

    if (req.body.role) {
      user = await User.create({
        nom,
        prenom,
        email,
        password,
        numero_telephone,
        isitStudent,
        role
      });
    } else {

      if (req.body.isitStudent && !supervisors.includes(req.body.email)) {
        user = await User.create({
          nom,
          prenom,
          email,
          password,
          numero_telephone,
          isitStudent,
          specialite
        });
      } else {
        if (!req.body.isitStudent && (supervisors.includes(req.body.email))) {
          user = await User.create({
            nom,
            prenom,
            email,
            password,
            numero_telephone,
            isitStudent,
            grade
          });
        } else {
          next(new ErrorResponse('Veuillez saisir une adresse e-mail correcte !', 409))
        }
      }
    }
    if (user) {
      res.status(201)
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        password: user.password,
        numero_telephone: user.numero_telephone,
        isitStudent: user.isitStudent,
        specialite: user.specialite,
        grade: user.grade,
        role: user.role,
        token: user.generateJWT()
      })
    } else {
      next(new ErrorResponse('Données utilisateur invalides !', 400));
    }
    const resetToken = user.getResetToken()
    // Send email
    const resetUrl = `${req.body.protocol}://${req.body.hostname}:${req.body.port ? req.body.port : ''}/Activation-email/${resetToken}`

    const message = `${user.nom} ,Vous recevez cet e-mail car vous avez demandé à vous inscrire sur notre plateforme. Veuillez cliquer sur le lien suivant pour mettre à jour votre mot de passe : ${resetUrl}`
    try {
      await sendEmail({
        email: user.email,
        subject: 'Activation-Email',
        message
      });

    } catch (error) {
      console.log(error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await newUser.save({ validateBeforeSave: false });


      next(new ErrorResponse('L\'e-mail n\'a pas pu être envoyé', 500))
    }

  } catch (err) {
    console.log(err)
    next(new ErrorResponse('Erreur du serveur', 500))
  }
};

// @desc     Forgot password
// @route    POST /api/users/ForgotPassword
// @access   Public
exports.ForgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (user) {
    const resetToken = user.getResetToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.body.protocol}://${req.body.hostname}:${req.body.port ? req.body.port : ''}/Réinitialisation du mot de passe/${resetToken}`

    const message = `${user.nom} Vous recevez cet e-mail car vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour mettre à jour votre mot de passe:${resetUrl}`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Gradify-Récupération de mot de passe',
        message
      })

      res.status(200).json({
        success: true,
        message: 'E-mail envoyé',
      })
    } catch (error) {
      console.log(error)
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })

      next(new ErrorResponse('L\'e-mail n\'a pas pu être envoyé', 500))

    }
  } else {
    next(new ErrorResponse('L\'adresse e-mail n\'existe pas', 404))
  }
}
// @desc     Reset password
// @route    PUT /api/users/resetPassword/:resettoken
// @access   Public
exports.ResetPassword = asyncHandler(async (req, res, next) => {

  const resetPasswordToken = crypto.createHash('sha256').update(req.body.rpt).digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (user) {
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined


    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: user.password,
      numero_telephone: user.numero_telephone,
      isitStudent: user.isitStudent,
      grade: user.grade,
      specialite: user.specialite,
      token: user.generateJWT()
    })
  }
})
// @desc     Authenticate user 
// @route    POST /api/users/LogIn
// @access   Public
exports.LogIn = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const matchPassword = await bcrypt.compare(password, user.password);
  if (user && (matchPassword)) {
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
}
exports.LogOut = async (req, res) => {
  // Remove the token from local storage
  localStorage.removeItem('token');

  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const newTokens = req.user.tokens.filter(t => t !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};



/*
exports.LogOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter(t => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};*/

exports.ModifyAccount = async (req, res, next) => {
  try {
    const email = req.body.email;
    const newAccountData = req.body.newAccountData;

    const user = await User.findOne({ email });

    if (!user) {
      next(new ErrorResponse('Utilisateur introuvable', 404))
    }

    for (const field in newAccountData) {
      user[field] = newAccountData[field];
    }

    await user.save();

    return res.status(200).json({ message: 'Compte modifié avec succès' });
  } catch (error) {
    next(new ErrorResponse('Erreur lors de la modification du compte :"' + error.message, 500))
  }
}

// @desc     Get user profile
// @route    GET /api/users/userProfile
// @access   Private
exports.GetUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        numero_telephone: user.numero_telephone,
        isitStudent: user.isitStudent,
        token: user.generateJWT(),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(new ErrorResponse('Erreur du serveur', 500));
  }
};

// @desc     Get accepted students
// @route    GET /api/users//acceptedStudents
// @access   Private
exports.GetAcceptedStudent = async (req, res, next) => {
  try {
    const acceptedStudent = await Topic.find(
      {
        'supervisor.studentList': { $elemMatch: { $eq: req.user._id } }
      },
      { user: 1 }
    )
      .populate({ path: 'user', select: 'nom prenom email nom_sujet' })
      .exec();

    const usersData = acceptedStudent.map((topic) => {
      return {
        nom: topic.user.nom,
        prenom: topic.user.prenom,
        email: topic.user.email,
        nom_sujet: topic.user.nom_sujet,
        id: topic.id
      };
    });

    res.status(200).json(usersData);
  } catch (err) {
    console.error(err);
    next(new ErrorResponse('Erreur du serveur', 500));
  }
};













