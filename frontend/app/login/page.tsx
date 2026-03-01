'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../components/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('store_owner');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/api/auth/login', { email, password, role });
    router.push(role === 'admin' ? '/admin' : '/store/me/dashboard');
  };

  return (
    <main className="container py-4" style={{ maxWidth: 420 }}>
      <h2 className="mb-3">Sign in</h2>
      <form onSubmit={submit} className="card p-3 shadow-sm">
        <input className="form-control mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <select className="form-select mb-3" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="store_owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-primary">Login</button>
      </form>
    </main>
  );
}
