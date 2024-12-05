const mongoose=require('mongoose');
const Review= require('./review');
const { listingSchema } = require('../schema');
const wrapAsync = require('../utils/wrapAsync');
const User= require('./user');
const { string } = require('joi');



const schema = mongoose.Schema;
const ListingSchema =  new schema({
    title:{type:String,
        required:true
    } ,
    description: {type:String} ,
    image: {
        url:String,
        filename:String
        
    },
    price: {type:Number},
    location: {type:String},
    country: {type:String},
    reviews:[{type:schema.Types.ObjectId,ref:'Review'}],
    owner:{type:schema.Types.ObjectId,ref:'User'},
    // avgRating :Number

})


const Listing = mongoose.model('listing',ListingSchema);
module.exports = Listing;


ListingSchema.post('findByIdAndDelete',async(listing)=>{
    if(listing){
        Review.deleteMany({_id:{$in:listing.reviews}})
    }
})
