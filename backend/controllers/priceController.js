const multipliers = {
  New:  { min: 0.85, max: 0.95 },
  Good: { min: 0.60, max: 0.75 },
  Fair: { min: 0.35, max: 0.55 },
  Poor: { min: 0.15, max: 0.30 }
};

// GET /api/price/suggest?condition=Good&original_price=40000
const suggestPrice = async (req, res) => {
  const { condition, original_price } = req.query;

  if (!condition || !original_price) {
    return res.status(400).json({ message: 'Condition and original_price are required' });
  }
  if (!multipliers[condition]) {
    return res.status(400).json({ message: 'Invalid condition. Use: New, Good, Fair, Poor' });
  }

  const price = Number(original_price);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'original_price must be a positive number' });
  }

  try {
    const m = multipliers[condition];
    const suggested_min = Math.round(price * m.min);
    const suggested_max = Math.round(price * m.max);

    res.json({ condition, original_price: price, suggested_min, suggested_max });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { suggestPrice };
