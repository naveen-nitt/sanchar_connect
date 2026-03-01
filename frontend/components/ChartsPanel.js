'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export default function ChartsPanel({ visitsOverTime = [], ageDistribution = [], birthdayMonths = [] }) {
  return (
    <div className="row g-3">
      <div className="col-lg-6">
        <div className="card p-3 h-100">
          <h6>Visits over Time</h6>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={visitsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#0d6efd" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card p-3 h-100">
          <h6>Age Distribution</h6>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={ageDistribution.map((x) => ({ range: String(x._id), count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-3">
          <h6>Birthday Month Distribution</h6>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={birthdayMonths.map((x) => ({ month: x._id, count: x.count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#fd7e14" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
