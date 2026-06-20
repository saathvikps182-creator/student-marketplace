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

  if (loading) return <div className="text-center py-20 text-ink/40 italic">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="font-serif text-3xl text-ink">My Wishlist</h2>
      <p className="text-ink/50 text-sm mt-1 mb-8">Items you're keeping an eye on.</p>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 text-ink/40">
          <p className="italic">Your wishlist is empty</p>
          <Link to="/" className="text-clay hover:underline mt-2 inline-block text-sm">Browse listings</Link>
        </div>
      ) : (
        <div className="divide-y divide-sand border-t border-b border-sand">
          {wishlist.map(item => (
            <div key={item.wishlist_id} className="py-4 flex gap-4 items-center">
              <img
                src={item.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-sm flex-shrink-0 border border-sand"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink truncate">{item.title}</h3>
                <p className="font-serif text-clay mt-0.5">₹{item.price}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] uppercase tracking-wide text-ink/40">{item.category}</span>
                  <span className="text-xs italic text-ink/50">{item.condition}</span>
                  {item.is_sold && <span className="text-xs uppercase tracking-wide text-clay">Sold</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/listings/${item.id}`}
                  className="text-xs uppercase tracking-wide border border-sand text-ink/60 px-3 py-1.5 rounded-sm hover:border-clay hover:text-clay transition-colors text-center">
                  View
                </Link>
                <button onClick={() => handleRemove(item.id)}
                  className="text-xs uppercase tracking-wide text-clay/70 px-3 py-1.5 hover:text-clay transition-colors">
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
