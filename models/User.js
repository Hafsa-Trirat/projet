const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const Specialite = ["Psychopedagogie", "guidance-et-orientation", "systeme-educatif"];
const Grade = ["professeur", "MCA", "MCB", "MAA", "MAB", "Doctorant"];

const userSchema = mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Quelle est votre nom ?']
    },
    prenom: {
        type: String,
        required: [true, 'Quelle est votre prénom ?']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Veuillez saisir une adresse e-mail valide.']
    },
    password: {
        type: String,
        required: [true, 'Veuillez saisir un mot de passe valide.']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    numero_telephone: {
        type: String,
        required: [true, 'Veuillez saisir un numéro de téléphone valide.']
    },
    isitStudent: {
        type: Boolean,
        required: [true, 'Veuillez saisir votre role']
    },
    grade: {
        type: Grade,
        required: [true, 'Veuillez saisir votre grade']
    },
    specialite: {
        type: Specialite,
        required: [true, 'Veuillez saisir votre spécialité']
    },
    role: {
        type: String,
        default: "client"
    },
    notifications: [
        {
            title: String,
            in: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            link: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
            notificationType: String,
        }
    ],
    supervisor: {
        studentList: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },




})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    )
}
userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}
const User = mongoose.model('User', userSchema)

module.exports = User

