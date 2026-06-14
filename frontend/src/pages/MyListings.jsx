import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const res = await api.get('/listings/my');
        setListings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
        <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          + New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">You have no listings yet</p>
          <Link to="/create" className="text-blue-600 hover:underline mt-2 inline-block">Create your first listing</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              <img
                src={listing.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{listing.title}</h3>
                <p className="text-blue-600 font-bold">₹{listing.price}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{listing.category}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{listing.condition}</span>
                  {listing.is_sold && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Sold</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/listings/${listing.id}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 text-center">
                  View
                </Link>
                <button onClick={() => handleDelete(listing.id)}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;