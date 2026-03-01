'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    store_name: '', owner_name: '', email: '', password: '', whatsapp_access_token: '', whatsapp_phone_number_id: ''
  });

  const load = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const createStore = async (e) => {
    e.preventDefault();
    await api.post('/admin/stores', form);
    setForm({ store_name: '', owner_name: '', email: '', password: '', whatsapp_access_token: '', whatsapp_phone_number_id: '' });
    await load();
    alert('Store created successfully');
  };

  return (
    <main className="container py-4">
      <h2>Admin Panel</h2>
      <div className="row mb-4">
        <div className="col"><div className="card p-3"><h6>Total Stores</h6><h3>{stats?.totalStores || 0}</h3></div></div>
        <div className="col"><div className="card p-3"><h6>Total Platform Customers</h6><h3>{stats?.totalCustomers || 0}</h3></div></div>
      </div>
      <form className="card p-3" onSubmit={createStore}>
        <h5>Create Store</h5>
        <div className="row g-2">
          {Object.keys(form).map((k) => (
            <div className="col-md-6" key={k}>
              <input
                required={['store_name', 'owner_name', 'email', 'password'].includes(k)}
                type={k.includes('password') ? 'password' : 'text'}
                className="form-control"
                placeholder={k}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-dark mt-3">Create</button>
      </form>
    </main>
  );
}
