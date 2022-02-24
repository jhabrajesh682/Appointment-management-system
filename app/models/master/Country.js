const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema=new Schema({
    name:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    }
},{
    timestamps:true
})

countrySchema.virtual('Cities', {
    ref: 'City',
    localField: '_id',
    foreignField: 'countryId',
    justOne: false

});
countrySchema.set('toObject', { virtuals: true });
countrySchema.set('toJSON', { virtuals: true });

module.exports = Country = mongoose.model("Country", countrySchema);