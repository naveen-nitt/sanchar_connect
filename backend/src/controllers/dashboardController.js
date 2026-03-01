const Customer = require('../models/Customer');

const dashboardStats = async (req, res) => {
  const { storeId } = req.params;
  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [totalCustomers, totalVisitsRow, weeklyVisits, monthlyVisits, upcoming7, upcomingMonth] =
    await Promise.all([
      Customer.countDocuments({ store_id: storeId }),
      Customer.aggregate([{ $match: { store_id: storeId } }, { $group: { _id: null, total: { $sum: '$visit_count' } } }]),
      Customer.countDocuments({ store_id: storeId, modified_datetime: { $gte: weekAgo } }),
      Customer.countDocuments({ store_id: storeId, modified_datetime: { $gte: monthAgo } }),
      Customer.find({ store_id: storeId }).lean(),
      Customer.find({ store_id: storeId }).lean()
    ]);

  const inNext7 = upcoming7.filter((c) => {
    const dob = new Date(c.date_of_birth);
    const thisYearDob = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    const diffDays = (thisYearDob - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const inThisMonth = upcomingMonth.filter((c) => new Date(c.date_of_birth).getMonth() === now.getMonth()).length;

  const visitsOverTime = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$modified_datetime' } }, visits: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', visits: 1, _id: 0 } }
  ]);

  const ageDistribution = await Customer.aggregate([
    { $match: { store_id: storeId, age: { $ne: null } } },
    { $bucket: { groupBy: '$age', boundaries: [0, 18, 21, 24, 30, 40, 60, 120], default: 'Other', output: { count: { $sum: 1 } } } }
  ]);

  const birthdayMonths = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $group: { _id: { $month: '$date_of_birth' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    metrics: {
      totalCustomers,
      uniqueCustomers: totalCustomers,
      totalVisits: totalVisitsRow[0]?.total || 0,
      weeklyVisits,
      monthlyVisits,
      upcomingBirthdays7Days: inNext7,
      upcomingBirthdaysThisMonth: inThisMonth
    },
    charts: { visitsOverTime, ageDistribution, birthdayMonths }
  });
};

module.exports = { dashboardStats };
