'use client';

import { useState } from 'react';
import api from '../components/api';

export default function AdminPage() {
  const [store_name, setStoreName] = useState('');
  const [owner_name, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/api/admin/stores', { store_name, owner_name, email, password });
    setResult(res.data);
  };

  return (
    <main className="container py-4" style={{ maxWidth: 600 }}>
      <h2>Create Store</h2>
      <form className="card p-3" onSubmit={create}>
        <input className="form-control mb-2" placeholder="Store Name" onChange={(e) => setStoreName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Owner Name" onChange={(e) => setOwnerName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-3" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-dark">Create</button>
      </form>
      {result && <pre className="mt-3">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
