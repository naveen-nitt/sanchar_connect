'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '../../../lib/api';
import MetricCards from '../../../components/MetricCards';
import ChartsPanel from '../../../components/ChartsPanel';

export default function StoreDashboard({ params }) {
  const [dashboard, setDashboard] = useState({ metrics: {}, charts: {}, templates: [] });
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ minAge: '', maxAge: '', birthMonth: '', minVisitCount: '', tags: '' });
  const [bulk, setBulk] = useState({ message: 'Hi {{name}}, get {{discount}} off till {{expiry_date}}', discount: '20%', expiry_date: '31 Dec' });
  const [individual, setIndividual] = useState({ mobile_number: '', message: '' });
  const [template, setTemplate] = useState({ name: '', body: '', is_draft: true });

  const query = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString(), [filters]);

  const load = async () => {
    const [dRes, cRes] = await Promise.all([
      api.get(`/store/${params.storeId}/dashboard`),
      api.get(`/store/${params.storeId}/customers?${query}`)
    ]);
    setDashboard(dRes.data);
    setCustomers(cRes.data.customers);
  };

  useEffect(() => { load(); }, [query]);

  const exportData = (format) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/store/${params.storeId}/customers/export?${query}&format=${format}`, '_blank');
  };

  return (
    <main className="container-fluid p-4">
      <h3 className="mb-3">Store Dashboard - {params.storeId}</h3>
      <MetricCards metrics={dashboard.metrics || {}} />
      <ChartsPanel charts={dashboard.charts || {}} />

      <div className="card mb-4"><div className="card-body">
        <h5>Filters & Export</h5>
        <div className="row g-2">
          <div className="col-md-2"><input className="form-control" placeholder="Min Age" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Max Age" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Birth Month" value={filters.birthMonth} onChange={(e) => setFilters({ ...filters, birthMonth: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Min Visits" value={filters.minVisitCount} onChange={(e) => setFilters({ ...filters, minVisitCount: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="Tags (vip,new)" value={filters.tags} onChange={(e) => setFilters({ ...filters, tags: e.target.value })} /></div>
          <div className="col-md-2 d-flex gap-2"><button className="btn btn-outline-primary w-100" onClick={() => exportData('csv')}>CSV</button><button className="btn btn-outline-success w-100" onClick={() => exportData('xlsx')}>Excel</button></div>
        </div>
      </div></div>

      <div className="card mb-4"><div className="card-body">
        <h5>Bulk WhatsApp Campaign</h5>
        <textarea className="form-control mb-2" rows={3} value={bulk.message} onChange={(e) => setBulk({ ...bulk, message: e.target.value })} />
        <div className="row g-2 mb-2">
          <div className="col-md-3"><input className="form-control" placeholder="Discount" value={bulk.discount} onChange={(e) => setBulk({ ...bulk, discount: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" placeholder="Expiry Date" value={bulk.expiry_date} onChange={(e) => setBulk({ ...bulk, expiry_date: e.target.value })} /></div>
          <div className="col-md-3"><button className="btn btn-primary w-100" onClick={() => api.post(`/store/${params.storeId}/whatsapp/bulk`, { message: bulk.message, variables: { discount: bulk.discount, expiry_date: bulk.expiry_date }, filters }).then(() => alert('Bulk triggered'))}>Send Bulk</button></div>
        </div>
      </div></div>

      <div className="card mb-4"><div className="card-body">
        <h5>Individual Messaging</h5>
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder="Mobile" value={individual.mobile_number} onChange={(e) => setIndividual({ ...individual, mobile_number: e.target.value })} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Message" value={individual.message} onChange={(e) => setIndividual({ ...individual, message: e.target.value })} /></div>
          <div className="col-md-3"><button className="btn btn-secondary w-100" onClick={() => api.post(`/store/${params.storeId}/whatsapp/individual`, individual).then(() => alert('Sent'))}>Send</button></div>
        </div>
      </div></div>

      <div className="card mb-4"><div className="card-body">
        <h5>Template Manager</h5>
        <div className="row g-2 align-items-center mb-3">
          <div className="col-md-3"><input className="form-control" placeholder="Template name" value={template.name} onChange={(e) => setTemplate({ ...template, name: e.target.value })} /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Message body" value={template.body} onChange={(e) => setTemplate({ ...template, body: e.target.value })} /></div>
          <div className="col-md-3"><button className="btn btn-outline-dark w-100" onClick={() => api.post(`/store/${params.storeId}/templates`, template).then(load)}>Save Draft</button></div>
        </div>
        <ul className="list-group">
          {(dashboard.templates || []).map((t) => <li key={t._id} className="list-group-item d-flex justify-content-between"><span><strong>{t.name}</strong>: {t.body}</span><span className="badge bg-secondary">{t.is_draft ? 'draft' : 'active'}</span></li>)}
        </ul>
      </div></div>

      <div className="card"><div className="card-body">
        <h5>Customers ({customers.length})</h5>
        <div className="table-responsive"><table className="table table-sm">
          <thead><tr><th>Name</th><th>Mobile</th><th>Age</th><th>DOB</th><th>Visits</th><th>Last Visit</th></tr></thead>
          <tbody>{customers.map((c) => <tr key={c._id}><td>{c.name}</td><td>{c.mobile_number}</td><td>{c.age}</td><td>{new Date(c.date_of_birth).toLocaleDateString()}</td><td>{c.visit_count}</td><td>{new Date(c.modified_datetime).toLocaleString()}</td></tr>)}</tbody>
        </table></div>
      </div></div>
    </main>
  );
}
