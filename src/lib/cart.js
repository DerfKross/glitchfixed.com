import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'glitchfixed_cart_v1';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const actions = {
    addItem(product) {
      setItems((prev) => {
        const existing = prev.find((x) => x.productId === product.id);
        if (existing) {
          return prev.map((x) => x.productId === product.id ? { ...x, quantity: x.quantity + 1 } : x);
        }
        return [...prev, { productId: product.id, name: product.name, unitPrice: product.priceCents, quantity: 1 }];
      });
    },
    updateQty(productId, quantity) {
      const safeQty = Math.max(1, Number(quantity) || 1);
      setItems((prev) => prev.map((x) => x.productId === productId ? { ...x, quantity: safeQty } : x));
    },
    removeItem(productId) {
      setItems((prev) => prev.filter((x) => x.productId !== productId));
    },
    clear() {
      setItems([]);
    }
  };

  const totals = useMemo(() => ({
    itemCount: items.reduce((acc, x) => acc + x.quantity, 0),
    subtotalCents: items.reduce((acc, x) => acc + (x.unitPrice * x.quantity), 0)
  }), [items]);

  return <CartContext.Provider value={{ items, ...actions, ...totals }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
