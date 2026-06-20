import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['Books', 'Electronics', 'Furniture', 'Clothing', 'Cycles & Sports', 'Stationery', 'Other'];
const CONDITIONS = ['New', 'Good', 'Fair', 'Poor'];

function CreateListing() {
  const [form, setForm] = useState({ title: '', description: '', category: '', condition: '', original_price: '', price: '', location: '' });
  const [images, setImages] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getSuggestion = async () => {
    if (!form.condition || !form.original_price) return;
    try {
      const res = await api.get('/price/suggest', {
        params: { condition: form.condition, original_price: form.original_price }
      });
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

  const inputClass = "w-full bg-transparent border-b border-sand px-1 py-2 text-ink focus:outline-none focus:border-clay transition-colors";
  const labelClass = "block text-xs uppercase tracking-wide text-ink/50 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="font-serif text-3xl text-ink mb-1">List an item</h2>
      <p className="text-ink/50 text-sm mb-8">Add the details below — students nearby will see it on the board.</p>

      {error && (
        <p className="border border-clay/40 text-clay bg-clay/5 px-3 py-2 rounded-sm mb-6 text-sm">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClass}>Title</label>
          <input name="title" value={form.title} onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Engineering Mathematics Textbook" required />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className={inputClass}
            placeholder="Describe the item condition, edition, etc." />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={inputClass} required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange}
              onBlur={getSuggestion}
              className={inputClass} required>
              <option value="">Select condition</option>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Original Price — what you paid (₹)</label>
          <input name="original_price" type="number" value={form.original_price} onChange={handleChange}
            onBlur={getSuggestion}
            className={inputClass}
            placeholder="e.g. 40000" required />
          <p className="text-xs text-ink/35 mt-1.5 italic">Used to suggest a fair resale price based on condition.</p>
        </div>

        {suggested && (
          <div className="border border-moss/30 bg-moss/5 rounded-sm p-3 text-sm">
            <p className="text-moss font-medium">Suggested price range</p>
            <p className="text-ink/70 font-serif text-lg mt-0.5">₹{suggested.suggested_min} — ₹{suggested.suggested_max}</p>
          </div>
        )}

        <div>
          <label className={labelClass}>Your Price (₹)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange}
            className={inputClass}
            placeholder="Enter your price" required />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Hostel Block A, Main Campus" />
        </div>
        <div>
          <label className={labelClass}>Images (max 4)</label>
          <input type="file" accept="image/*" multiple
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 4))}
            className="w-full text-sm text-ink/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-sand file:bg-paper file:text-ink/70 file:text-xs file:uppercase file:tracking-wide hover:file:border-clay" />
          {images.length > 0 && <p className="text-xs text-ink/40 mt-1.5 italic">{images.length} image(s) selected</p>}
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-ink text-paper py-2.5 rounded-sm text-sm uppercase tracking-wide hover:bg-clay transition-colors disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
