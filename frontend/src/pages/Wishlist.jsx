import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        setWishlist(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (listingId) => {
    try {
      await api.delete(`/wishlist/${listingId}`);
      setWishlist(wishlist.filter(w => w.id !== listingId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Your wishlist is empty</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Browse listings</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map(item => (
            <div key={item.wishlist_id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              <img
                src={item.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                <p className="text-blue-600 font-bold">₹{item.price}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.condition}</span>
                  {item.is_sold && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Sold</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/listings/${item.id}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 text-center">
                  View
                </Link>
                <button onClick={() => handleRemove(item.id)}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;