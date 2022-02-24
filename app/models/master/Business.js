const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({

    businessName: {
        type: String,
        required: true
    },

    businesssDescription: {
        type: String,
        required: true
    },
    CountryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true                            //should be required
    }

    


}, {
    timestamps: true
})

module.exports = Business = mongoose.model('Business', businessSchema)