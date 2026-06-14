const express = require('express');
const router = express.Router();
const { getListings, getMyListings, getListingById, createListing, updateListing, deleteListing, markAsSold } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListingById);
router.post('/', protect, upload.array('images', 4), createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.patch('/:id/sold', protect, markAsSold);

module.exports = router;
