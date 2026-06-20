import { Link } from 'react-router-dom';

const CONDITION_STYLE = {
  New: 'text-moss',
  Good: 'text-clay',
  Fair: 'text-amber-700',
  Poor: 'text-stone-500',
};

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`} className="group block">
      <div className="border border-sand/80 rounded-md overflow-hidden bg-paper transition-colors group-hover:border-clay/50">
        <div className="relative overflow-hidden">
          <img
            src={listing.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={listing.title}
            className="w-full h-44 object-cover grayscale-[15%] transition duration-300 group-hover:grayscale-0"
          />
        </div>
        <div className="p-3 border-t border-sand/80">
          <h3 className="font-medium text-ink truncate leading-snug">{listing.title}</h3>
          <div className="flex items-baseline justify-between mt-1.5">
            <span className="font-serif text-lg text-clay">₹{listing.price}</span>
            <span className={`text-xs italic underline decoration-dotted underline-offset-4 ${CONDITION_STYLE[listing.condition] || 'text-stone-500'}`}>
              {listing.condition}
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-wide text-ink/40 mt-2">{listing.category}</p>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;
