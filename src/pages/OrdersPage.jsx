import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { EmptyState, ErrorState, Loading } from '../components/LoadingErrorEmpty';

export default function OrdersPage() {
  const { getIdToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        const data = await api.listOrders(token);
        setOrders(data.orders ?? data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading label="Loading your orders…" />;
  if (error) return <ErrorState error={error} />;
  if (!orders.length) return <EmptyState label="No orders yet." />;

  return (
    <section>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div className="row" key={order.id}>
          <div>
            <p>{order.id}</p>
            <small>{order.status}</small>
          </div>
          <Link to={`/success?orderId=${order.id}`}>Open</Link>
        </div>
      ))}
    </section>
  );
}
