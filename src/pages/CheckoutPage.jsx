import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import { api } from '../lib/api';

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const { user, getIdToken, signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleCheckout() {
    setBusy(true);
    setError('');
    try {
      if (!user) {
        await signIn();
        return;
      }
      const token = await getIdToken();
      const order = await api.createOrder(items.map(({ productId, quantity }) => ({ productId, quantity })), token);

      const origin = window.location.origin;
      const successUrl = `${origin}/success?orderId=${order.id}`;
      const cancelUrl = `${origin}/cart`;

      const checkout = await api.createCheckout(order.id, token, successUrl, cancelUrl);
      window.location.assign(checkout.url);
    } catch (e) {
      setError(e.message.includes('stock') ? 'Insufficient stock for one or more products.' : e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2>Checkout</h2>
      <p>Items: {items.length}</p>
      <p>Total: ${(subtotalCents / 100).toFixed(2)}</p>
      {error ? <p className="state-error">{error}</p> : null}
      <button disabled={!items.length || busy} onClick={handleCheckout}>{busy ? 'Preparing checkout…' : 'Pay with Stripe'}</button>
      {!user ? <p>You will be prompted to sign in before checkout.</p> : null}
      <button onClick={() => navigate('/cart')}>Back to cart</button>
    </section>
  );
}
