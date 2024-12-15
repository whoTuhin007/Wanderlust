const Listing = require('../models/listing');
const review = require('../models/review');
const ExpressError = require('../utils/expressErr');


module.exports.index = async (req, res) => {
    // let infos = await Listing.find({});
    // let newInfos = infos.map(async (info) => {
    //     let totRating = 0;


    //     if (info.reviews && (info.reviews.length > 0)) {
    //         await info.populate('reviews');

    //         for ( review of info.reviews){
    //             totRating += review.rating;

    //         }
    //         info.avgRating= await totRating/(info.reviews.length);

    //     }





    // })
    // console.log(newInfos);
    let infos = await Listing.find({});

    // Use Promise.all to resolve all asynchronous operations
    let newInfos = await Promise.all(
        infos.map(async (info) => {
            let totRating = 0;

            if (info.reviews && info.reviews.length > 0) {
                await info.populate('reviews');

                // Calculate total rating
                for (let review of info.reviews) {
                    totRating += review.rating;
                }

                // Calculate average rating
                info.avgRating = totRating / info.reviews.length;
            }

            // Return the modified info object
            return info;
        })
    );

    // console.log(newInfos);




    res.render('main.ejs', { newInfos });




}

module.exports.newCreateListing = (req, res) => {

    res.render('new.ejs');
}


module.exports.postListing = async (req, res, next) => {



    let listing = req.body.Listing;
    if (!req.body.Listing) {
        next(new ExpressError(400, 'Send valid data for listing'))
    };
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {
        url, filename
    }
    // console.log(url, '..', filename)

    const newListing = new Listing(listing);

    newListing.owner = req.user._id;



    await newListing.save();
    req.flash('success', 'Listing added successfully')
    res.redirect('/listing');




}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    let info = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    console.log(info)

    if (!info) {
        req.flash('error', 'Listing Doesnot Exists');
        res.redirect('/listing');
    }
    else {
        res.render('listing.ejs', { info });
    }



}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    let originalImage = listing.image.url;
    originalImage.replace('/upload', '/upload/w_250')
    res.render('edit.ejs', { listing, originalImage });
}

module.exports.editedListing = async (req, res) => {
    let { id } = req.params;

    let listing = req.body.Listing;

    if (!listing) {
        next(new ExpressError(400, 'Send valid data for listing'))
    };

    if (req.file != undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {
            url, filename
        }
    }


    await Listing.findByIdAndUpdate(id, { ...listing });

    req.flash('success', 'Listing updated successfully')
    res.redirect(`/listing/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully')

    res.redirect('/listing');
}

module.exports.findListing = async (req, res) => {
    // Get the search query from the request
    let listingDetails = req.body.query.trim().toLowerCase(); // Normalize for comparison
    let listings = await Listing.find({});
    let infos = [];

    // Filter listings based on the search query
    for (let listing of listings) {
        let title = listing.title.toLowerCase(); // Normalize the title for case-insensitive search

        if (title === listingDetails || title.includes(listingDetails)) {
            console.log(listing);
            infos.push(listing);
        }
    }

    // If no matching listings are found, handle this case
    if (infos.length === 0) {
        req.flash('error', 'No listings found for your search.');
        return res.redirect('/listing'); // Redirect back to the main listing page
    }

    // Populate reviews and calculate ratings for matched listings
    let newInfos = await Promise.all(
        infos.map(async (info) => {
            let totRating = 0;

            if (info.reviews && info.reviews.length > 0) {
                await info.populate('reviews');

                // Calculate total and average ratings
                for (let review of info.reviews) {
                    totRating += review.rating;
                }

                info.avgRating = totRating / info.reviews.length;
            }

            // Return the updated info object
            return info;
        })
    );

    // Render the main page with filtered listings
    res.render('main.ejs', { newInfos });
};
