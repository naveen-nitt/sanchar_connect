const XLSX = require('xlsx');

const mapCustomersForExport = (customers) =>
  customers.map((c) => ({
    Name: c.name,
    Mobile: c.mobile_number,
    Age: c.age,
    DOB: c.date_of_birth ? new Date(c.date_of_birth).toISOString().slice(0, 10) : '',
    VisitCount: c.visit_count,
    LastVisit: c.modified_datetime ? new Date(c.modified_datetime).toISOString() : ''
  }));

const toCsvBuffer = (rows) => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return Buffer.from(csv, 'utf-8');
};

const toXlsxBuffer = (rows) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = { mapCustomersForExport, toCsvBuffer, toXlsxBuffer };
