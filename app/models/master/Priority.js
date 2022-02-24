const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const prioritySchema=new Schema({
    
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

module.exports=Priority=mongoose.model('Priority',prioritySchema)