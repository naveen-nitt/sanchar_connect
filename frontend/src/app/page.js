import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-5">
      <h1>Sanchar Connect</h1>
      <p>QR-based customer acquisition + WhatsApp marketing platform.</p>
      <div className="d-flex gap-3">
        <Link href="/login" className="btn btn-primary">Store/Admin Login</Link>
      </div>
    </main>
  );
}
