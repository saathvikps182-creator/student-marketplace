import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import MyListings from './pages/MyListings';
import Wishlist from './pages/Wishlist';
import Messages from './pages/Messages';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/create" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
          <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;