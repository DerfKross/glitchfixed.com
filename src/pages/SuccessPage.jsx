import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { ErrorState, Loading } from '../components/LoadingErrorEmpty';

export default function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const { getIdToken, user } = useAuth();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const token = await getIdToken();
        const [orderData, itemData] = await Promise.all([
          api.getOrder(orderId, token),
          api.getOrderItems(orderId, token)
        ]);
        setOrder(orderData.order ?? orderData);
        setItems(itemData.items ?? itemData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, user]);

  if (!orderId) return <ErrorState error="Missing orderId in URL." />;
  if (!user) return <p>Please sign in to view this order. <Link to="/account">Account</Link></p>;
  if (loading) return <Loading label="Loading order…" />;
  if (error) return <ErrorState error={error} />;

  return (
    <section>
      <h2>Order Confirmation</h2>
      <p>Order ID: {order?.id}</p>
      <p>Status: <strong>{order?.status || 'pending'}</strong></p>
      <ul>
        {items.map((item) => (
          <li key={item.id || `${item.productId}-${item.quantity}`}>
            {item.productName || item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <Link to="/orders">View all orders</Link>
    </section>
  );
}
