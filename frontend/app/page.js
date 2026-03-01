import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-5">
      <h1>Sanchar Connect</h1>
      <p className="text-muted">QR-based customer acquisition and WhatsApp marketing.</p>
      <div className="d-flex gap-3">
        <Link href="/login" className="btn btn-primary">Store Login</Link>
        <Link href="/admin" className="btn btn-outline-dark">Admin Panel</Link>
      </div>
    </main>
  );
}
