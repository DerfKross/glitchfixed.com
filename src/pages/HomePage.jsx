import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useCart } from '../lib/cart';
import { EmptyState, ErrorState, Loading } from '../components/LoadingErrorEmpty';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data.products ?? data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading label="Loading products…" />;
  if (error) return <ErrorState error={error} />;
  if (!products.length) return <EmptyState label="No products available right now." />;

  return (
    <section>
      <h2>Products</h2>
      <div className="grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${(product.priceCents / 100).toFixed(2)}</strong></p>
            <button onClick={() => addItem(product)}>Add to cart</button>
          </article>
        ))}
      </div>
    </section>
  );
}
