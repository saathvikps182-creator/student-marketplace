const pool = require('../config/db');

// GET /api/listings
const getListings = async (req, res) => {
  const { category, condition, min_price, max_price, search, sort } = req.query;
  let query = `SELECT l.*, u.name AS seller_name, u.usn AS seller_usn
               FROM listings l JOIN users u ON l.seller_id = u.id
               WHERE l.is_sold = false AND l.is_archived = false`;
  const params = [];
  let i = 1;

  if (category) { query += ` AND l.category = $${i++}`; params.push(category); }
  if (condition) { query += ` AND l.condition = $${i++}`; params.push(condition); }
  if (min_price) { query += ` AND l.price >= $${i++}`; params.push(min_price); }
  if (max_price) { query += ` AND l.price <= $${i++}`; params.push(max_price); }
  if (search) {
    query += ` AND (l.title ILIKE $${i} OR l.description ILIKE $${i})`;
    params.push(`%${search}%`); i++;
  }

  query += sort === 'price_asc' ? ' ORDER BY l.price ASC'
         : sort === 'price_desc' ? ' ORDER BY l.price DESC'
         : ' ORDER BY l.created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
};

// GET /api/listings/my
const getMyListings = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM listings WHERE seller_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/listings/:id
const getListingById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.*, u.name AS seller_name, u.usn AS seller_usn, u.college_name
       FROM listings l JOIN users u ON l.seller_id = u.id WHERE l.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/listings
const createListing = async (req, res) => {
  const { title, description, category, condition, price, suggested_min, suggested_max, location } = req.body;
  const images = req.files ? req.files.map(f => f.path) : [];

  if (!title || !category || !condition || !price) {
    return res.status(400).json({ message: 'Title, category, condition, and price are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO listings (seller_id, title, description, category, condition, price, suggested_min, suggested_max, images, location, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW() + INTERVAL '30 days')
       RETURNING *`,
      [req.user.id, title, description, category, condition, price, suggested_min, suggested_max, images, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating listing' });
  }
};

// PUT /api/listings/:id
const updateListing = async (req, res) => {
  const { title, description, category, condition, price, location } = req.body;
  try {
    const check = await pool.query('SELECT seller_id FROM listings WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    if (check.rows[0].seller_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const result = await pool.query(
      `UPDATE listings SET title=$1, description=$2, category=$3, condition=$4, price=$5, location=$6
       WHERE id=$7 RETURNING *`,
      [title, description, category, condition, price, location, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/listings/:id
const deleteListing = async (req, res) => {
  try {
    const check = await pool.query('SELECT seller_id FROM listings WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    if (check.rows[0].seller_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await pool.query('DELETE FROM listings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/listings/:id/sold
const markAsSold = async (req, res) => {
  try {
    const check = await pool.query('SELECT seller_id FROM listings WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Listing not found' });
    if (check.rows[0].seller_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const result = await pool.query('UPDATE listings SET is_sold = true WHERE id = $1 RETURNING *', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getListings, getMyListings, getListingById, createListing, updateListing, deleteListing, markAsSold };
