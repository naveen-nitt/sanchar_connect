const Customer = require('../models/Customer');
const { mapCustomersForExport, toCsvBuffer, toXlsxBuffer } = require('../services/exportService');

const exportCustomers = async (req, res) => {
  const { store_id, format = 'csv' } = req.query;
  const customers = await Customer.listByStore(store_id);
  const rows = mapCustomersForExport(customers);

  if (format === 'xlsx') {
    const file = toXlsxBuffer(rows);
    res.setHeader('Content-Disposition', `attachment; filename=${store_id}-customers.xlsx`);
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(file);
  }

  const csv = toCsvBuffer(rows);
  res.setHeader('Content-Disposition', `attachment; filename=${store_id}-customers.csv`);
  res.type('text/csv');
  return res.send(csv);
};

module.exports = { exportCustomers };
