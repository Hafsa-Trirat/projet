const mongoose = require('mongoose')

const methodes =['','']
const phasethreeschema = mongoose.Schema({
    choix_dechantillonnage: {
        definiftion_population: {
            type: String,
            required: [true, 'Veuillez entrer un nom pour la population choisée']
        },
        lien: {
            type: String,
            required: [true, 'Veuillez entrer un lien'],
            validate: {
            validator: function(value) {
                return /^(http|https):\/\/[^ "]+$/.test(value);
            },
            message: 'Format d\'URL invalide'
            }
        },
        methode_dechantillonage: {
            type: String,
            required: [true, 'Veuillez entrer une méthode d\'échantillonnage']
        },
        choix_de_methode: {
            choix_de_methode: {
                type: methodes,
                required:[true, 'Veuillez entrer une méthode parmi les méthodes proposées!']
            },
            justification: {
                type:String,
                required: [true, 'Veiullez justifier votre choix!']
            },
            developpement_des_outils: {
                nom_doutil:{
                    type: String,
                    required:[true, 'Veuillez entrer un nom pour l\'outil']
                },
                definition_doutil:{
                    type: String,
                    required: [true, 'Veuillez entrer une définition pour l\'outil']
                },
                demarche_developpement: {
                    type: String,
                    required: [true, 'Veiullez entrer une description pour la démarche de developpement']
                },
                qualite_methodologique: {
                    type: String,
                    required: [true, 'Veiullez entrer une description pour la qualité méthodologique']
                },
                enquete_finale: {
                    synthese: {
                         type:String,
                         required:[true, 'Veuillez rédiger une synthèse']
                    }
                }
            },
            student: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                }
            ],
            supervisor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User' 
            }
        }
    }
    
})


const PhaseThree = mongoose.model('PhaseThree', phasethreeschema)

module.exports = PhaseThree