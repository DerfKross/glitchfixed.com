import { useAuth } from '../lib/auth';

export default function AccountPage() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <p>Loading account…</p>;

  return (
    <section>
      <h2>Account</h2>
      {user ? (
        <>
          <p>Email: {user.signInDetails?.loginId || 'N/A'}</p>
          <p>Sub: {user.userId}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <p>You are not signed in.</p>
          <button onClick={signIn}>Sign in</button>
        </>
      )}
    </section>
  );
}
