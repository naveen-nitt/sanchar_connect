const { stringify } = require('csv-stringify/sync');
const XLSX = require('xlsx');

const mapRows = (customers) => customers.map((customer) => ({
  Name: customer.name,
  Mobile: customer.mobile_number,
  Age: customer.age || '',
  DOB: customer.date_of_birth ? new Date(customer.date_of_birth).toISOString().slice(0, 10) : '',
  VisitCount: customer.visit_count,
  LastVisit: customer.modified_datetime ? new Date(customer.modified_datetime).toISOString() : ''
}));

const toCsvBuffer = (customers) => Buffer.from(stringify(mapRows(customers), { header: true }));

const toXlsxBuffer = (customers) => {
  const worksheet = XLSX.utils.json_to_sheet(mapRows(customers));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

module.exports = { toCsvBuffer, toXlsxBuffer };
