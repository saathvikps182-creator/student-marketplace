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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-sm">
        <h2 className="font-serif text-3xl text-ink text-center mb-1">Join the board</h2>
        <p className="text-ink/50 text-sm text-center mb-8">Create your CampusMart account</p>

        {error && (
          <p className="border border-clay/40 text-clay bg-clay/5 px-3 py-2 rounded-sm mb-5 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors"
              placeholder="Your full name" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors"
              placeholder="your@email.com" required />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">USN</label>
            <input name="usn" value={form.usn} onChange={handleChange}
              className="w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors"
              placeholder="e.g. 4PS22IS045" required />
            <p className="text-xs text-ink/35 mt-1.5 italic">Your college roll number</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">College Name</label>
            <input name="college_name" value={form.college_name} onChange={handleChange}
              className="w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors"
              placeholder="e.g. PES College of Engineering" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1.5">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors"
              placeholder="minimum 8 characters" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-ink text-paper py-2.5 rounded-sm text-sm uppercase tracking-wide hover:bg-clay transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          Already have an account? <Link to="/login" className="text-clay hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
