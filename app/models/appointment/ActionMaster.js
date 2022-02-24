const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionSchema = new Schema({

    actionName:{
        type: String,
        required: true
    },
    actionDiscription:{
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = ActionRequired = mongoose.model('ActionRequired', actionSchema)