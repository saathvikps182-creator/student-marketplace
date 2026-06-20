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

  if (loading) return <div className="text-center py-20 text-ink/40 italic">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-serif text-3xl text-ink">My Listings</h2>
          <p className="text-ink/50 text-sm mt-1">Items you've put on the board.</p>
        </div>
        <Link to="/create"
          className="border border-clay text-clay px-4 py-2 rounded-sm text-xs uppercase tracking-wide hover:bg-clay hover:text-paper transition-colors">
          New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-ink/40">
          <p className="italic">You have no listings yet</p>
          <Link to="/create" className="text-clay hover:underline mt-2 inline-block text-sm">Create your first listing</Link>
        </div>
      ) : (
        <div className="divide-y divide-sand border-t border-b border-sand">
          {listings.map(listing => (
            <div key={listing.id} className="py-4 flex gap-4 items-center">
              <img
                src={listing.images?.[0] || 'https://via.placeholder.com/100x100?text=No+Image'}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-sm flex-shrink-0 border border-sand"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink truncate">{listing.title}</h3>
                <p className="font-serif text-clay mt-0.5">₹{listing.price}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] uppercase tracking-wide text-ink/40">{listing.category}</span>
                  <span className="text-xs italic text-ink/50">{listing.condition}</span>
                  {listing.is_sold && <span className="text-xs uppercase tracking-wide text-clay">Sold</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/listings/${listing.id}`}
                  className="text-xs uppercase tracking-wide border border-sand text-ink/60 px-3 py-1.5 rounded-sm hover:border-clay hover:text-clay transition-colors text-center">
                  View
                </Link>
                <button onClick={() => handleDelete(listing.id)}
                  className="text-xs uppercase tracking-wide text-clay/70 px-3 py-1.5 hover:text-clay transition-colors">
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
