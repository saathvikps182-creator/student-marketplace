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
    <nav className="fixed top-0 left-0 right-0 bg-paper/95 backdrop-blur-sm text-ink z-50 border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-serif text-xl tracking-tight">
          CampusMart
        </Link>
        <div className="flex gap-5 items-center text-sm">
          <Link to="/" className="text-ink/70 hover:text-clay transition-colors">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="text-ink/70 hover:text-clay transition-colors">Sell</Link>
              <Link to="/wishlist" className="text-ink/70 hover:text-clay transition-colors">Wishlist</Link>
              <Link to="/messages" className="text-ink/70 hover:text-clay transition-colors">Messages</Link>
              <Link to="/my-listings" className="text-ink/70 hover:text-clay transition-colors">My Listings</Link>
              <span className="text-ink/40 hidden sm:inline">{user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="border border-clay text-clay px-3 py-1 rounded-sm text-xs uppercase tracking-wide hover:bg-clay hover:text-paper transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink/70 hover:text-clay transition-colors">Login</Link>
              <Link
                to="/register"
                className="border border-clay text-clay px-3 py-1 rounded-sm text-xs uppercase tracking-wide hover:bg-clay hover:text-paper transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
