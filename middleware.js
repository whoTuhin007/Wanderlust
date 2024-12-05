const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema,reviewSchema } = require('./schema');
const ExpressError = require('./utils/expressErr');
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'Please Login to continue!')
        return res.redirect('/login')
    }
    next()
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'You dont have permission to delete');
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash('error', 'You dont are not the author of the review');
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(404, errMsg);

    }
    else {
        next()
    }

}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(404, errMsg);

    }
    else {
        next()
    }

}