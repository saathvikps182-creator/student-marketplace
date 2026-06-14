import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', usn: '', password: '', college_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Join CampusMart</h2>
        {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your full name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">USN</label>
            <input name="usn" value={form.usn} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 4PS22IS045" required />
            <p className="text-xs text-gray-400 mt-1">Your college roll number</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
            <input name="college_name" value={form.college_name} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. PES College of Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="minimum 8 characters" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;