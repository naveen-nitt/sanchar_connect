'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../../components/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>({});
  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/dashboard/metrics').then((r) => setMetrics(r.data));
    api.get('/api/dashboard/visits-over-time').then((r) => setVisits(r.data));
  }, []);

  return (
    <main className="container py-3">
      <h2>Store Dashboard</h2>
      <div className="row g-2 my-2">
        {Object.entries(metrics).map(([k, v]) => (
          <div className="col-6" key={k}>
            <div className="card p-2"><small>{k}</small><h5>{String(v)}</h5></div>
          </div>
        ))}
      </div>
      <div className="card p-3">
        <h6>Visits Over Time</h6>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={visits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
