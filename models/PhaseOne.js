const mongoose = require('mongoose')

const choices =['Recherche confirmative','Recherche exploratoire'];

const phaseoneschema = mongoose.Schema({
    etat_de_savoir: {
        type: String,
        required: [true, 'Veuillez ajouter un état des connaissances']
    },
    problematique: {
        type: String,
        required: [true, 'Veuillez ajouter une problématique']
    },
    choix_de_recherche: {
        type: choices,
        required: [true, 'Veuillez ajouter un choix de recherche']
    },
    bibliographie: {
        type: String,
        required: [true, 'Veuillez ajouter une bibliographie']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
      supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    

})
const PhaseOne = mongoose.model('PhaseOne', phaseoneschema)

module.exports = PhaseOne

  