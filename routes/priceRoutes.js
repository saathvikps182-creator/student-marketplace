const express = require('express');
const router = express.Router();
const { suggestPrice } = require('../controllers/priceController');

router.get('/suggest', suggestPrice);

module.exports = router;
