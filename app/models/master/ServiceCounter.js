const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const serviceCounterSchema=new Schema({
    
    medicalCenterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MedicalCenter',
        required:true
    },
    stationCenterwiseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StationCenterwise',
        required:true
    },
    stationTypeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StationType',
        required:true
    },
    
    live:{
        type:Boolean,
        required:true,
        default:true
    },
    
    
},{
    timestamps:true
})

module.exports=ServiceCounter=mongoose.model('ServiceCounter',serviceCounterSchema)