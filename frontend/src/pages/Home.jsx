import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Cycles & Sports', 'Stationery', 'Other'];
const CONDITIONS = ['All', 'New', 'Good', 'Fair', 'Poor'];

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (condition !== 'All') params.condition = condition;
      if (sort !== 'newest') params.sort = sort;
      const res = await api.get('/listings', { params });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, condition, sort, search]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">What's on the board today</h1>
        <p className="text-ink/50 text-sm mt-1">Bought, sold, and passed on by students on campus.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for books, electronics, furniture..."
          className="flex-1 bg-paper border border-sand rounded-sm px-4 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-clay transition-colors"
        />
        <button
          type="submit"
          className="bg-ink text-paper px-6 py-2 rounded-sm text-sm uppercase tracking-wide hover:bg-clay transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-sand">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="bg-paper border border-sand rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-clay">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}
          className="bg-paper border border-sand rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-clay">
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-paper border border-sand rounded-sm px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-clay">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink/40 italic">Looking through the board...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-ink/40 italic">Nothing here yet — be the first to list something.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </div>
  );
}

export default Home;
