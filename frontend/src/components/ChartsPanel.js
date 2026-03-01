'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export default function ChartsPanel({ charts }) {
  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-6">
        <div className="card"><div className="card-body" style={{ height: 300 }}>
          <h6>Visits Over Time</h6>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={charts.visitsOverTime || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#0d6efd" />
            </LineChart>
          </ResponsiveContainer>
        </div></div>
      </div>
      <div className="col-lg-6">
        <div className="card"><div className="card-body" style={{ height: 300 }}>
          <h6>Age Distribution</h6>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={charts.ageDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="bucket" /><YAxis /><Tooltip />
              <Bar dataKey="count" fill="#198754" />
            </BarChart>
          </ResponsiveContainer>
        </div></div>
      </div>
      <div className="col-lg-12">
        <div className="card"><div className="card-body" style={{ height: 280 }}>
          <h6>Birthday Month Distribution</h6>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={charts.birthdayMonthDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip />
              <Bar dataKey="count" fill="#fd7e14" />
            </BarChart>
          </ResponsiveContainer>
        </div></div>
      </div>
    </div>
  );
}
