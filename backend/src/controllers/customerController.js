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
  let customer = await Customer.findOne({ store_id, mobile_number: sanitizedMobile });

  if (customer) {
    customer.name = name;
    customer.date_of_birth = date_of_birth;
    customer.age = age;
    customer.modified_datetime = new Date();
    customer.visit_count += 1;
    customer.source = source;
    await customer.save();
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
  const {
    store_id,
    minAge,
    maxAge,
    birthdayMonth,
    minVisits,
    lastVisitFrom,
    tags,
    search
  } = req.query;
  const query = { store_id };

  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Number(minAge);
    if (maxAge) query.age.$lte = Number(maxAge);
  }
  if (birthdayMonth) query.$expr = { $eq: [{ $month: '$date_of_birth' }, Number(birthdayMonth)] };
  if (minVisits) query.visit_count = { $gte: Number(minVisits) };
  if (lastVisitFrom) query.modified_datetime = { $gte: new Date(lastVisitFrom) };
  if (tags) query.tags = { $in: tags.split(',') };
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { mobile_number: { $regex: search } }];

  const customers = await Customer.find(query).sort({ modified_datetime: -1 }).limit(5000);
  res.json({ customers });
};

module.exports = { registerCustomer, listCustomers };
