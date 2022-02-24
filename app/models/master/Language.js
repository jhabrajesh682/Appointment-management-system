const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const languagesSchema=new Schema({
    cityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'City'
    },
    languages:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
})

module.exports=Languages=mongoose.model('Languages',languagesSchema)