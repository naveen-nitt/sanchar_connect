const buildCustomerFilter = ({ storeId, minAge, maxAge, birthMonth, minVisitCount, tags, lastVisitFrom, lastVisitTo }) => {
  const filter = { store_id: storeId, is_active: true };
  if (minAge || maxAge) {
    filter.age = {};
    if (minAge) filter.age.$gte = Number(minAge);
    if (maxAge) filter.age.$lte = Number(maxAge);
  }
  if (birthMonth) {
    filter.$expr = { $eq: [{ $month: '$date_of_birth' }, Number(birthMonth)] };
  }
  if (minVisitCount) filter.visit_count = { $gte: Number(minVisitCount) };
  if (tags) filter.tags = { $in: String(tags).split(',').map((tag) => tag.trim()) };
  if (lastVisitFrom || lastVisitTo) {
    filter.modified_datetime = {};
    if (lastVisitFrom) filter.modified_datetime.$gte = new Date(lastVisitFrom);
    if (lastVisitTo) filter.modified_datetime.$lte = new Date(lastVisitTo);
  }
  return filter;
};

module.exports = { buildCustomerFilter };
