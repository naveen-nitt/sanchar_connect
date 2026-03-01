'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'admin') router.push('/admin');
      else router.push(`/store/${data.user.store_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 460 }}>
      <h2>Login</h2>
      <form onSubmit={submit} className="card p-4 shadow-sm">
        <input className="form-control mb-3" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-3" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-primary">Login</button>
      </form>
    </main>
  );
}
