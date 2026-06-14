const pool = require('../config/db');

// GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (listing_id, LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
        m.listing_id, l.title AS listing_title, l.images AS listing_images,
        CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_user_id,
        u.name AS other_user_name,
        m.content AS last_message, m.sent_at
       FROM messages m
       JOIN listings l ON m.listing_id = l.id
       JOIN users u ON u.id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY listing_id, LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), m.sent_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/messages/:listingId?with=userId
const getThread = async (req, res) => {
  const { listingId } = req.params;
  const { with: otherId } = req.query;
  try {
    const result = await pool.query(
      `SELECT m.*, u.name AS sender_name FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.listing_id = $1
         AND ((m.sender_id = $2 AND m.receiver_id = $3) OR (m.sender_id = $3 AND m.receiver_id = $2))
       ORDER BY m.sent_at ASC`,
      [listingId, req.user.id, otherId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/messages/:listingId
const sendMessage = async (req, res) => {
  const { listingId } = req.params;
  const { receiver_id, content } = req.body;
  if (!content || !receiver_id) return res.status(400).json({ message: 'receiver_id and content are required' });
  if (content.length > 500) return res.status(400).json({ message: 'Message too long (max 500 chars)' });

  try {
    const result = await pool.query(
      `INSERT INTO messages (listing_id, sender_id, receiver_id, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [listingId, req.user.id, receiver_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/messages/:id/read
const markAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE messages SET is_read = true WHERE id = $1 AND receiver_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getConversations, getThread, sendMessage, markAsRead };
