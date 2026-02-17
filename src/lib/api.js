const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || 'Request failed';
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data;
}

export const api = {
  getProducts: () => request('/products'),
  createOrder: (items, token) => request('/orders', { method: 'POST', body: { items }, token }),
  createCheckout: (orderId, token, successUrl, cancelUrl) => request('/checkout', { method: 'POST', body: { orderId, successUrl, cancelUrl }, token }),
  getOrder: (orderId, token) => request(`/orders/${orderId}`, { token }),
  getOrderItems: (orderId, token) => request(`/orders/${orderId}/items`, { token }),
  listOrders: (token) => request('/orders', { token })
};
