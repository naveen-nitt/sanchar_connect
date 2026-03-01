'use client';

import { useRef, useState } from 'react';
import api from '../../../lib/api';

export default function CustomerLanding({ params }) {
  const [form, setForm] = useState({ name: '', mobile_number: '', date_of_birth: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const lastSubmitRef = useRef(0);

  const submit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmitRef.current < 5000) {
      setMessage('Please wait before submitting again.');
      return;
    }
    lastSubmitRef.current = now;
    if (!/^\d{10,15}$/.test(form.mobile_number.replace(/\D/g, ''))) {
      setMessage('Please enter valid mobile number.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/customer/register', { ...form, store_id: params.storeId, source: 'QR' });
      setMessage('Thank you! Your details are submitted successfully.');
      setForm({ name: '', mobile_number: '', date_of_birth: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 520 }}>
      <h2>Customer Check-in</h2>
      <p className="text-muted">Store: {params.storeId}</p>
      <form onSubmit={submit} className="card p-4 shadow-sm">
        <input className="form-control mb-3" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-3" placeholder="Mobile Number" required value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} />
        <label className="form-label">Date of Birth *</label>
        <input className="form-control mb-3" type="date" required value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
        <button className="btn btn-success" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </main>
  );
}
