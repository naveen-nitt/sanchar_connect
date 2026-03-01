'use client';

import { useState } from 'react';
import api from '../../../lib/api';

export default function CustomerForm({ params }) {
  const [form, setForm] = useState({ name: '', mobile_number: '', date_of_birth: '' });
  const [status, setStatus] = useState({ loading: false, message: '' });
  const [lastSubmit, setLastSubmit] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmit < 3000) {
      setStatus({ loading: false, message: 'Please wait before submitting again.' });
      return;
    }

    setLastSubmit(now);
    setStatus({ loading: true, message: '' });
    try {
      await api.post('/customer/register', { ...form, store_id: params.storeId, source: 'QR' });
      setStatus({ loading: false, message: 'Thank you! Your visit has been recorded.' });
      setForm({ name: '', mobile_number: '', date_of_birth: '' });
    } catch (err) {
      setStatus({ loading: false, message: err.response?.data?.message || 'Submission failed' });
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 500 }}>
      <h2>Welcome</h2>
      <p>Fill details to get exclusive offers.</p>
      <form className="card p-3" onSubmit={submit}>
        <label className="form-label">Name</label>
        <input required className="form-control mb-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label className="form-label">Mobile Number</label>
        <input required pattern="[0-9]{10,15}" className="form-control mb-2" value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} />
        <label className="form-label">Date of Birth</label>
        <input required type="date" className="form-control mb-3" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
        <button disabled={status.loading} className="btn btn-success">Submit</button>
      </form>
      {status.message && <div className="alert alert-info mt-3">{status.message}</div>}
    </main>
  );
}
