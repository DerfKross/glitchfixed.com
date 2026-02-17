import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { EmptyState } from '../components/LoadingErrorEmpty';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotalCents } = useCart();

  if (!items.length) {
    return (
      <section>
        <h2>Your Cart</h2>
        <EmptyState label="Your cart is empty." />
        <Link to="/">Browse products</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>Your Cart</h2>
      {items.map((item) => (
        <div className="row" key={item.productId}>
          <div>
            <p>{item.name}</p>
            <small>${(item.unitPrice / 100).toFixed(2)} each</small>
          </div>
          <input type="number" min="1" value={item.quantity} onChange={(e) => updateQty(item.productId, e.target.value)} />
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}
      <p><strong>Subtotal: ${(subtotalCents / 100).toFixed(2)}</strong></p>
      <Link className="button-link" to="/checkout">Go to checkout</Link>
    </section>
  );
}
