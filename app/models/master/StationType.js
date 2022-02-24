const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const stationTypeSchema=new Schema({
    
    stationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Station',
        required:true
    },
    
    type:{
        type:String,
        required:true
    },
    
    
},{
    timestamps:true
})

module.exports=StationType=mongoose.model('StationType',stationTypeSchema)

