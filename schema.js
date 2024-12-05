const joi = require('joi');
module.exports.listingSchema = joi.object({
    Listing: joi.object({
        title: joi.string().required(),
        image:joi.string().allow('',null),
        location: joi.string().required(),
        country:joi.string().required(),
        description: joi.string().required(),
        price: joi.number().min(0).required()

    }).required()

    
})



module.exports.reviewSchema= joi.object({
    review : joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    })

})