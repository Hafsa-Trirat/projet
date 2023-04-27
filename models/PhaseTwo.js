const mongoose = require('mongoose')



const phasetwoschema = mongoose.Schema({
    student:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ,
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})


const PhaseTwo = mongoose.model('PhaseTwo', phasetwoschema)

module.exports = PhaseTwo