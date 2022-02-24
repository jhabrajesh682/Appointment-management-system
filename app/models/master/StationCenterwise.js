const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const stationCenterwiseSchema=new Schema({
    
    medicalCenterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MedicalCenter',
        required:true
    },
    stationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Station',
        required:true
    },
    
},{
    timestamps:true
})

stationCenterwiseSchema.virtual('ServiceCounters',{
    ref:'ServiceCounter',
    localField:'_id',
    foreignField:'stationCenterwiseId',
    justOne:false
})
stationCenterwiseSchema.set('toObject', { virtuals: true });
stationCenterwiseSchema.set('toJSON', { virtuals: true });

module.exports=StationCenterwise=mongoose.model('StationCenterwise',stationCenterwiseSchema)