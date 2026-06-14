import { useState, useEffect } from 'react';
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

  const fetchListings = async () => {
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
  };

  useEffect(() => { fetchListings(); }, [category, condition, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for books, electronics, furniture..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={condition} onChange={(e) => setCondition(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No listings found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      )}
    </div>
  );
}

export default Home;