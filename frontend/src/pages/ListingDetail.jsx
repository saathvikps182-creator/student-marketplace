import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CONDITION_STYLE = {
  New: 'text-moss',
  Good: 'text-clay',
  Fair: 'text-amber-700',
  Poor: 'text-stone-500',
};

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

  if (loading) return <div className="text-center py-20 text-ink/40 italic">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-ink/40 italic">Listing not found</div>;

  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="border border-sand rounded-md overflow-hidden">
            <img
              src={listing.images?.[activeImg] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
          </div>
          {listing.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {listing.images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 object-cover rounded-sm cursor-pointer border ${activeImg === i ? 'border-clay' : 'border-sand'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex justify-between items-start gap-3">
            <h1 className="font-serif text-2xl text-ink leading-snug">{listing.title}</h1>
            {listing.is_sold && (
              <span className="text-xs uppercase tracking-wide border border-clay text-clay px-2 py-0.5 rounded-sm flex-shrink-0">Sold</span>
            )}
          </div>
          <p className="font-serif text-3xl text-clay mt-2">₹{listing.price}</p>
          {listing.suggested_min && (
            <p className="text-sm text-ink/40 italic mt-1">Suggested: ₹{listing.suggested_min} — ₹{listing.suggested_max}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-[11px] uppercase tracking-wide text-ink/40">{listing.category}</span>
            <span className={`text-xs italic underline decoration-dotted underline-offset-4 ${CONDITION_STYLE[listing.condition] || 'text-stone-500'}`}>
              {listing.condition}
            </span>
          </div>
          <p className="text-ink/70 mt-5 leading-relaxed">{listing.description}</p>

          <div className="border-t border-sand mt-5 pt-4 space-y-1">
            {listing.location && <p className="text-sm text-ink/50">Location — {listing.location}</p>}
            <p className="text-sm text-ink/50">Listed by {listing.seller_name} ({listing.seller_usn})</p>
          </div>

          {/* Actions */}
          {!isOwner && !listing.is_sold && (
            <div className="mt-6 space-y-3">
              <button onClick={handleWishlist}
                className={`w-full py-2 rounded-sm border text-sm uppercase tracking-wide transition-colors ${wishlisted ? 'bg-clay/10 text-clay border-clay' : 'border-sand text-ink/60 hover:border-clay hover:text-clay'}`}>
                {wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
              </button>
              <form onSubmit={handleMessage} className="space-y-2">
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2}
                  className="w-full bg-transparent border border-sand rounded-sm px-3 py-2 text-sm text-ink focus:outline-none focus:border-clay transition-colors"
                  placeholder="Message the seller..." required />
                <button type="submit"
                  className="w-full bg-ink text-paper py-2 rounded-sm text-sm uppercase tracking-wide hover:bg-clay transition-colors">
                  Send Message
                </button>
                {msgSent && <p className="text-moss text-sm text-center italic">Message sent!</p>}
              </form>
            </div>
          )}

          {isOwner && !listing.is_sold && (
            <button onClick={handleMarkSold}
              className="mt-6 w-full border border-moss text-moss py-2 rounded-sm text-sm uppercase tracking-wide hover:bg-moss hover:text-paper transition-colors">
              Mark as Sold
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
