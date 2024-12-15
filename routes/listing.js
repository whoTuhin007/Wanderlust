const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync')


const {isLoggedIn, isOwner,validateListing} = require('../middleware');
const listingController = require('../controller/listing');
const multer  = require('multer');
const {storage}= require('../cloudConfig')
const upload = multer({storage});

// //Root Route
// router.get('/', (req, res) => {
//     res.send('hi i am root');
// });

router.route('/')
.get( wrapAsync(listingController.index)).post( 
     isLoggedIn, 
    upload.single('Listing[image]'),
    validateListing,
    wrapAsync(listingController.postListing))
    .put(wrapAsync(listingController.findListing));

//Listing Index Route


// Create Route
router.get('/new', isLoggedIn, listingController.newCreateListing);
//Create POST Route


router.route('/:id')
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.editedListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// Show Route with ObjectId Validation



//Update Route with Corrected findById Query
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.editListing));









// Delete Route with ObjectId Validation



module.exports = router;


// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Listing = require('../models/listing');
// const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/expressErr');
// const { listingSchema } = require('../schema');

// // Validation Middleware
// const validateListing = (req, res, next) => {
//     if (!req.body.Listing) {
//         throw new ExpressError(400, 'Invalid request: Listing data is missing');
//     }
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         const errMsg = error.details.map((el) => el.message).join(',');
//         throw new ExpressError(400, errMsg);
//     }
//     next();
// };

// // ID Validation Middleware
// const validateObjectId = (req, res, next) => {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new ExpressError(400, 'Invalid ID format');
//     }
//     next();
// };

// // Listing Index Route
// router.get('/', wrapAsync(async (req, res) => {
//     const infos = await Listing.find({});
//     res.render('main.ejs', { infos });
// }));

// // Create Form Route
// router.get('/new', (req, res) => {
//     res.render('new.ejs');
// });

// // Create POST Route
// router.post('/', validateListing, wrapAsync(async (req, res, next) => {
//     const { Listing: listing } = req.body;
//     const newListing = new Listing(listing);
//     await newListing.save();
//     req.flash('success', 'Listing added successfully');
//     res.redirect('/listing');
// }));

// // Show Route with ObjectId Validation
// router.get('/:id', validateObjectId, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const info = await Listing.findById(id).populate('reviews');
//     if (!info) {
//         throw new ExpressError(404, 'Listing not found');
//     }
//     res.render('listing.ejs', { info });
// }));

// // Edit Form Route
// router.get('/:id/edit', validateObjectId, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         throw new ExpressError(404, 'Listing not found');
//     }
//     res.render('edit.ejs', { listing });
// }));

// // Update PUT Route
// router.put('/:id', validateObjectId, validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const { Listing: listingData } = req.body;
//     const updatedListing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });
//     if (!updatedListing) {
//         throw new ExpressError(404, 'Listing not found for update');
//     }
//     req.flash('success', 'Listing updated successfully');
//     res.redirect(`/listing/${id}`);
// }));

// // Delete Route
// router.delete('/:id', validateObjectId, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const deletedListing = await Listing.findByIdAndDelete(id);
//     if (!deletedListing) {
//         throw new ExpressError(404, 'Listing not found for deletion');
//     }
//     req.flash('success', 'Listing deleted successfully');
//     res.redirect('/listing');
// }));

// module.exports = router;


