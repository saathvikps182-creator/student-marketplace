import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-md transition p-3 cursor-pointer">
        <img
          src={listing.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={listing.title}
          className="w-full h-44 object-cover rounded-lg mb-3"
        />
        <h3 className="font-semibold text-gray-800 truncate">{listing.title}</h3>
        <p className="text-blue-600 font-bold mt-1">₹{listing.price}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{listing.category}</span>
          <span className={`px-2 py-0.5 rounded-full ${
            listing.condition === 'New' ? 'bg-green-100 text-green-700' :
            listing.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
            listing.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>{listing.condition}</span>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;