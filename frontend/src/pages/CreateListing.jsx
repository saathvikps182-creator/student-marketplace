import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Cycles & Sports', 'Stationery', 'Other'];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

function CreateListing() {
  const [form, setForm] = useState({ title: '', description: '', category: '', condition: '', price: '', location: '' });
  const [images, setImages] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getSuggestion = async () => {
    if (!form.category || !form.condition) return;
    try {
      const res = await api.get('/price/suggest', { params: { category: form.category, condition: form.condition } });
      setSuggested(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (suggested) {
        formData.append('suggested_min', suggested.suggested_min);
        formData.append('suggested_max', suggested.suggested_max);
      }
      images.forEach(img => formData.append('images', img));
      await api.post('/listings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Listing</h2>
      {error && <p className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Engineering Mathematics Textbook" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe the item condition, edition, etc." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              onBlur={getSuggestion}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange}
              onBlur={getSuggestion}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required>
              <option value="">Select condition</option>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Price Suggester */}
        {suggested && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-medium text-blue-700">💡 Suggested Price Range</p>
            <p className="text-blue-600">₹{suggested.suggested_min} — ₹{suggested.suggested_max}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Price (₹)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your price" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Hostel Block A, Main Campus" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 4)</label>
          <input type="file" accept="image/*" multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 4))}
            className="w-full text-sm text-gray-500" />
          {images.length > 0 && <p className="text-xs text-gray-400 mt-1">{images.length} image(s) selected</p>}
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;