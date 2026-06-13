const pool = require('../config/db');

const multipliers = {
  New:  { min: 0.85, max: 0.95 },
  Good: { min: 0.60, max: 0.75 },
  Fair: { min: 0.35, max: 0.55 },
  Poor: { min: 0.15, max: 0.30 }
};

// GET /api/price/suggest?category=Electronics&condition=Good
const suggestPrice = async (req, res) => {
  const { category, condition } = req.query;

  if (!category || !condition) {
    return res.status(400).json({ message: 'Category and condition are required' });
  }
  if (!multipliers[condition]) {
    return res.status(400).json({ message: 'Invalid condition. Use: New, Good, Fair, Poor' });
  }

  try {
    const result = await pool.query(
      'SELECT base_price_min, base_price_max FROM price_reference WHERE category = $1',
      [category]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found in price reference' });
    }

    const { base_price_min, base_price_max } = result.rows[0];
    const m = multipliers[condition];
    const suggested_min = Math.round(base_price_min * m.min);
    const suggested_max = Math.round(base_price_max * m.max);

    res.json({ category, condition, suggested_min, suggested_max });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { suggestPrice };
