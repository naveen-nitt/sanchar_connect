const validator = require('validator');
const Customer = require('../models/Customer');
const calcAge = require('../utils/calcAge');

const registerCustomer = async (req, res) => {
  const { store_id, name, mobile_number, date_of_birth, source = 'QR' } = req.body;
  if (!store_id || !name || !mobile_number || !date_of_birth) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const sanitizedMobile = mobile_number.replace(/\D/g, '');
  if (!validator.isMobilePhone(sanitizedMobile, 'any')) {
    return res.status(400).json({ message: 'Invalid mobile number' });
  }

  const age = calcAge(date_of_birth);
  let customer = await Customer.findByStoreAndMobile(store_id, sanitizedMobile);

  if (customer) {
    customer = await Customer.updateVisit(customer.id, { name, date_of_birth, age, source });
    return res.json({ message: 'Customer visit updated', customer });
  }

  customer = await Customer.create({
    store_id,
    name,
    mobile_number: sanitizedMobile,
    date_of_birth,
    age,
    source,
    first_visit_datetime: new Date(),
    modified_datetime: new Date()
  });

  return res.status(201).json({ message: 'Customer registered', customer });
};

const listCustomers = async (req, res) => {
  const { store_id, ...filters } = req.query;
  const customers = await Customer.listFiltered(store_id, filters);
  res.json({ customers });
};

module.exports = { registerCustomer, listCustomers };
