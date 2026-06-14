import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">🎓 CampusMart</Link>
        <div className="flex gap-4 items-center text-sm">
          <Link to="/" className="hover:underline">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:underline">+ Sell</Link>
              <Link to="/wishlist" className="hover:underline">Wishlist</Link>
              <Link to="/messages" className="hover:underline">Messages</Link>
              <Link to="/my-listings" className="hover:underline">My Listings</Link>
              <span className="text-blue-200">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="bg-white text-blue-600 px-3 py-1 rounded font-medium hover:bg-blue-50">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-medium hover:bg-blue-50">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;