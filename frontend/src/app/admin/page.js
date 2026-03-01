'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState({ totalStores: 0, totalCustomers: 0 });
  const [form, setForm] = useState({ store_name: '', owner_name: '', email: '', password: '' });
  const [created, setCreated] = useState(null);

  const load = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/admin/stores', form);
    setCreated(data);
    setForm({ store_name: '', owner_name: '', email: '', password: '' });
    load();
  };

  return (
    <main className="container py-4">
      <h2>Admin Panel</h2>
      <div className="row mb-4">
        <div className="col-md-4"><div className="card p-3"><div>Total Stores</div><h3>{stats.totalStores}</h3></div></div>
        <div className="col-md-4"><div className="card p-3"><div>Total Platform Customers</div><h3>{stats.totalCustomers}</h3></div></div>
      </div>

      <form className="card p-4 mb-4" onSubmit={submit}>
        <h5>Create Store</h5>
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder="Store Name" required value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Owner Name" required value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div className="col-md-1"><button className="btn btn-primary w-100">Create</button></div>
        </div>
      </form>

      {created && (
        <div className="alert alert-success">
          <div>Store created: <strong>{created.store.store_id}</strong></div>
          <div>Customer URL: <a href={created.customer_url}>{created.customer_url}</a></div>
          <div>QR: <a href={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${created.qr_url}`}>Download QR</a></div>
        </div>
      )}
    </main>
  );
}
