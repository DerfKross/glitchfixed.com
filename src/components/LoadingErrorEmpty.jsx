export function Loading({ label = 'Loading…' }) {
  return <p className="state state-loading">{label}</p>;
}

export function ErrorState({ error }) {
  return <p className="state state-error">{error}</p>;
}

export function EmptyState({ label }) {
  return <p className="state state-empty">{label}</p>;
}
