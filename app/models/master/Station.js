const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const stationSchema=new Schema({
    
    name:{
        type:String,
        required:true
    },
    
    alphabetCode:{
        type:String,
        unique:true,
        required:true
    },
    value:{
        type:Number,
        unique:true,
        required:true
    },
    
    
},{
    timestamps:true
})


stationSchema.virtual('Levers', {
    ref: 'Lever',
    localField: '_id',
    foreignField: 'determiningStation',
    justOne: false

});
stationSchema.set('toObject', { virtuals: true });
stationSchema.set('toJSON', { virtuals: true });

module.exports=Station=mongoose.model('Station',stationSchema)