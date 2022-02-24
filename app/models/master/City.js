const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema=new Schema({
    cityName:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    countryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    timeZoneName:{
        type:String,
        required:true // ex: Asia/Kolkata
    }
},{
    timestamps:true
})

citySchema.virtual('languages', {
    ref: 'Languages',
    localField: '_id',
    foreignField: 'cityId',
    justOne: false

});
citySchema.set('toObject', { virtuals: true });
citySchema.set('toJSON', { virtuals: true });

module.exports = City = mongoose.model("City", citySchema);