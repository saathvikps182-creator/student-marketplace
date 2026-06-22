const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const USN_REGEX = /^0[12]JST\d{2}[A-Z]{3}\d{3}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, usn, password, college_name, phone } = req.body;

  if (!name || !email || !usn || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!USN_REGEX.test(usn)) {
    return res.status(400).json({ message: 'Invalid USN format. Example: 01JST24UIS074' });
  }
  if (!PHONE_REGEX.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits starting with 6-9' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  try {
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const usnCheck = await pool.query('SELECT id FROM users WHERE usn = $1', [usn]);
    if (usnCheck.rows.length > 0) {
      return res.status(409).json({ message: 'USN already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, usn, password, college_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, usn, college_name, phone`,
      [name, email, usn.toUpperCase(), hashedPassword, college_name || '', phone]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Registration successful', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, usn: user.usn, college_name: user.college_name, phone: user.phone }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, usn, college_name, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe };
