'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '../../../lib/api';
import MetricCard from '../../../components/MetricCard';
import ChartsPanel from '../../../components/ChartsPanel';

export default function StoreDashboard({ params }) {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ minAge: '', maxAge: '', birthdayMonth: '', minVisits: '', tags: '' });
  const [message, setMessage] = useState('Hi {{name}}, get {{discount}} off till {{expiry_date}}');

  const load = async () => {
    const [statsRes, customersRes] = await Promise.all([
      api.get(`/dashboard/${params.storeId}`),
      api.get('/customer', { params: { store_id: params.storeId, ...filters } })
    ]);
    setStats(statsRes.data);
    setCustomers(customersRes.data.customers || []);
  };

  useEffect(() => { load(); }, []);

  const sendBulk = async () => {
    const selectedIds = customers.slice(0, 20).map((c) => c._id);
    await api.post('/messages/bulk', { customerIds: selectedIds, message, variables: { discount: '20%', expiry_date: '31 Dec' } });
    alert('Bulk send requested for sample customers.');
  };

  const exportUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const q = new URLSearchParams({ store_id: params.storeId, format: 'xlsx' }).toString();
    return { base, token, q };
  }, [params.storeId]);

  if (!stats) return <main className="container py-5">Loading dashboard...</main>;

  return (
    <main className="container py-4">
      <h2 className="mb-4">Store Dashboard - {params.storeId}</h2>

      <div className="row">
        <MetricCard title="Total Customers" value={stats.metrics.totalCustomers} />
        <MetricCard title="Total Visits" value={stats.metrics.totalVisits} />
        <MetricCard title="Weekly Visits" value={stats.metrics.weeklyVisits} />
        <MetricCard title="Monthly Visits" value={stats.metrics.monthlyVisits} />
        <MetricCard title="Birthdays Next 7 Days" value={stats.metrics.upcomingBirthdays7Days} />
        <MetricCard title="Birthdays This Month" value={stats.metrics.upcomingBirthdaysThisMonth} />
      </div>

      <div className="card p-3 mb-4">
        <h5>Customer Filters</h5>
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="Min Age" onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Max Age" onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Birthday Month(1-12)" onChange={(e) => setFilters({ ...filters, birthdayMonth: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Min Visits" onChange={(e) => setFilters({ ...filters, minVisits: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Tags (comma)" onChange={(e) => setFilters({ ...filters, tags: e.target.value })} /></div>
          <div className="col-auto"><button className="btn btn-primary" onClick={load}>Apply</button></div>
        </div>
      </div>

      <ChartsPanel {...stats.charts} />

      <div className="card p-3 my-4">
        <h5>WhatsApp Bulk Messaging</h5>
        <textarea className="form-control mb-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={sendBulk}>Send Sample Bulk (Top 20)</button>
          <a
            className="btn btn-outline-primary"
            href={`${exportUrl.base}/export/customers?${exportUrl.q}`}
            onClick={(e) => {
              e.preventDefault();
              fetch(`${exportUrl.base}/export/customers?${exportUrl.q}`, {
                headers: { Authorization: `Bearer ${exportUrl.token}` }
              })
                .then((r) => r.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${params.storeId}-customers.xlsx`;
                  a.click();
                });
            }}
          >
            Export Excel
          </a>
        </div>
      </div>

      <div className="card p-3">
        <h5>Latest Customers ({customers.length})</h5>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead><tr><th>Name</th><th>Mobile</th><th>Age</th><th>DOB</th><th>Visits</th><th>Last Visit</th></tr></thead>
            <tbody>
              {customers.slice(0, 50).map((c) => (
                <tr key={c._id}><td>{c.name}</td><td>{c.mobile_number}</td><td>{c.age}</td><td>{new Date(c.date_of_birth).toLocaleDateString()}</td><td>{c.visit_count}</td><td>{new Date(c.modified_datetime).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
