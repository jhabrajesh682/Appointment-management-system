const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const bucketSchema=new Schema({
    bucketName:{
        type:String,
        required:true
    },
    selectionType:{
        type:String,
        required:true,
        enum:['Single-select','Multi-select']
    },
    liverId:{
        type:mongoose.Types.ObjectId,
        ref:"Lever"
    }
    
},{
    timestamps:true
})

module.exports=Bucket=mongoose.model('Bucket',bucketSchema)