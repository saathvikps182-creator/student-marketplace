import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessage = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      await api.post(`/messages/${id}`, { receiver_id: listing.seller_id, content: message });
      setMsgSent(true);
      setMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkSold = async () => {
    try {
      await api.patch(`/listings/${id}/sold`);
      setListing({ ...listing, is_sold: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found</div>;

  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <img
              src={listing.images?.[activeImg] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={listing.title}
              className="w-full h-72 object-cover rounded-xl mb-3"
            />
            {listing.images?.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${activeImg === i ? 'border-blue-500' : 'border-transparent'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
              {listing.is_sold && <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">SOLD</span>}
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{listing.price}</p>
            {listing.suggested_min && (
              <p className="text-sm text-gray-400 mt-1">Suggested: ₹{listing.suggested_min} — ₹{listing.suggested_max}</p>
            )}
            <div className="flex gap-2 mt-3">
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{listing.category}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                listing.condition === 'New' ? 'bg-green-100 text-green-700' :
                listing.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                listing.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`}>{listing.condition}</span>
            </div>
            <p className="text-gray-600 mt-4">{listing.description}</p>
            {listing.location && <p className="text-sm text-gray-400 mt-2">📍 {listing.location}</p>}
            <p className="text-sm text-gray-400 mt-1">👤 {listing.seller_name} ({listing.seller_usn})</p>

            {/* Actions */}
            {!isOwner && !listing.is_sold && (
              <div className="mt-4 space-y-3">
                <button onClick={handleWishlist}
                  className={`w-full py-2 rounded-lg border font-medium ${wishlisted ? 'bg-red-50 text-red-500 border-red-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                  {wishlisted ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
                </button>
                <form onSubmit={handleMessage} className="space-y-2">
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Message the seller..." required />
                  <button type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                    Send Message
                  </button>
                  {msgSent && <p className="text-green-600 text-sm text-center">Message sent!</p>}
                </form>
              </div>
            )}

            {isOwner && !listing.is_sold && (
              <button onClick={handleMarkSold}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                Mark as Sold
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;