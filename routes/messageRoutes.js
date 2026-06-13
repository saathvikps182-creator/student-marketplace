const express = require('express');
const router = express.Router();
const { getConversations, getThread, sendMessage, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/:listingId', protect, getThread);
router.post('/:listingId', protect, sendMessage);
router.patch('/:id/read', protect, markAsRead);

module.exports = router;
