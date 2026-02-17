import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { CartProvider, useCart } from './lib/cart';
import { AuthProvider, useAuth } from './lib/auth';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import OrdersPage from './pages/OrdersPage';
import AccountPage from './pages/AccountPage';

function Layout() {
  const { itemCount } = useCart();
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <header>
        <h1>GlitchFixed</h1>
        <nav>
          <Link to="/">Products</Link>
          <Link to="/cart">Cart ({itemCount})</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/account">Account</Link>
          <span className="status">Signed in: {user ? 'YES' : 'NO'}</span>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading account…</p>;
  if (!user) return <Navigate to="/account" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout />
      </CartProvider>
    </AuthProvider>
  );
}
