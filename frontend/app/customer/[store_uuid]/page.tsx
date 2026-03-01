'use client';

import { useState } from 'react';
import api from '../../components/api';

export default function CustomerRegister({ params }: { params: { store_uuid: string } }) {
  const [name, setName] = useState('');
  const [mobile_number, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [date_of_birth, setDob] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/api/customer/register', {
      store_uuid: params.store_uuid,
      name,
      mobile_number,
      age: age ? Number(age) : null,
      date_of_birth: date_of_birth || null,
      source: 'qr',
    });
    alert('Thank you!');
  };

  return (
    <main className="container py-4" style={{ maxWidth: 500 }}>
      <h3 className="mb-3">Welcome</h3>
      <form className="card p-3" onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Full Name" required onChange={(e) => setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Mobile Number" required onChange={(e) => setMobile(e.target.value)} />
        <input className="form-control mb-2" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
        <input type="date" className="form-control mb-3" onChange={(e) => setDob(e.target.value)} />
        <button className="btn btn-success">Submit</button>
      </form>
    </main>
  );
}
