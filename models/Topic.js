const mongoose = require('mongoose')

const types = ['Recherche Amérique ','Recherche Action'];
const methodes = ['Descriptive comparée','Descriptive corrélationnelle','Descriptive  evaluative','Experimental'];

const topicSchema = mongoose.Schema({
    nom_sujet : {
        type: String,
        required: [true,'Veuillez entrer le nom d\'un sujet']
    },
    type_de_recherche: {
        type: types,
        required: [true, "Veuillez indiquer le type de votre recherche"]
    },
    methode_proposee: {
        type: methodes,
        required:[true, 'Veuillez entrer votre méthode suggérée']
    },
    population: {
        type: String,
        required: [true, 'Veuillez entrer votre population cible']
    },
    description: {
        type: String,
        required: [true, 'Veuillez entrer une description pour votre sujet']
    },
    chosen:{ // this one im gonna use it to hide the topic
        type: Boolean,
    },
    student: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }    ,
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },

})




const Topic = mongoose.model('Topic', topicSchema)

module.exports = Topic