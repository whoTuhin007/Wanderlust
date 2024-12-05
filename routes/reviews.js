const express = require('express');
const router = express.Router({mergeParams: true});

const wrapAsync = require('../utils/wrapAsync');
const reviewController = require('../controller/reviews');


const {isLoggedIn,validateReview, isAuthor} =  require('../middleware');





  

router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.newReviewPost))

//delete review

router.delete('/:reviewId',isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports= router;
