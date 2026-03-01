import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-5">
      <h1 className="mb-3">Sanchar Connect</h1>
      <p>QR-based customer acquisition and WhatsApp marketing platform.</p>
      <div className="d-flex gap-2">
        <Link href="/login" className="btn btn-primary">Login</Link>
      </div>
    </main>
  );
}
