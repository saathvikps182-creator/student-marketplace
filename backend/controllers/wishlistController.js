const pool = require('../config/db');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id AS wishlist_id, w.saved_at, l.*
       FROM wishlist w JOIN listings l ON w.listing_id = l.id
       WHERE w.user_id = $1 ORDER BY w.saved_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/wishlist/:listingId
const addToWishlist = async (req, res) => {
  const { listingId } = req.params;
  try {
    const existing = await pool.query('SELECT id FROM wishlist WHERE user_id=$1 AND listing_id=$2', [req.user.id, listingId]);
    if (existing.rows.length > 0) return res.status(409).json({ message: 'Already in wishlist' });

    await pool.query('INSERT INTO wishlist (user_id, listing_id) VALUES ($1, $2)', [req.user.id, listingId]);
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/wishlist/:listingId
const removeFromWishlist = async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id=$1 AND listing_id=$2', [req.user.id, req.params.listingId]);
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
