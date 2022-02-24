const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const leverSchema=new Schema({
    leverName:{
        type:String,
        required:true
    }
    
},{
    timestamps:true
})
leverSchema.virtual('buckets',{
    ref:'Bucket',
    localField:'_id',
    foreignField:'liverId',
    justOne:false
})
leverSchema.set('toObject', { virtuals: true });
leverSchema.set('toJSON', { virtuals: true });

module.exports=Lever=mongoose.model('Lever',leverSchema)