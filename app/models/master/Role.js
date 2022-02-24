const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({

    roleName: {
        type: String,
        required: true
    },

    roleDescription: {
        type: String,
        required: true
    },

    accessLevel: {
        type: String,
        enum: ['admin', 'operation head', 'bu head', 'country head', 'medical center head', 'station counter manager'],
        required: true,
        lowercase: true
    }

}, {
    timestamps: true
})

module.exports = Role = mongoose.model('Role', roleSchema)