const Customer = require('../models/Customer');

const dashboardStats = async (req, res) => {
  const { storeId } = req.params;
  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [totalCustomers, totalVisits, weeklyVisits, monthlyVisits, allCustomers] = await Promise.all([
    Customer.countByStore(storeId),
    Customer.sumVisitsByStore(storeId),
    Customer.countSince(storeId, weekAgo),
    Customer.countSince(storeId, monthAgo),
    Customer.listByStore(storeId)
  ]);

  const inNext7 = allCustomers.filter((c) => {
    const dob = new Date(c.date_of_birth);
    const thisYearDob = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    const diffDays = (thisYearDob - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const inThisMonth = allCustomers.filter((c) => new Date(c.date_of_birth).getMonth() === now.getMonth()).length;

  const visitsMap = {};
  const ageBuckets = { '18-21': 0, '21-24': 0, '25-30': 0, other: 0 };
  const birthdayMonthMap = {};

  allCustomers.forEach((c) => {
    const d = new Date(c.modified_datetime).toISOString().slice(0, 10);
    visitsMap[d] = (visitsMap[d] || 0) + 1;
    const m = new Date(c.date_of_birth).getMonth() + 1;
    birthdayMonthMap[m] = (birthdayMonthMap[m] || 0) + 1;

    if (c.age >= 18 && c.age <= 21) ageBuckets['18-21'] += 1;
    else if (c.age > 21 && c.age <= 24) ageBuckets['21-24'] += 1;
    else if (c.age >= 25 && c.age <= 30) ageBuckets['25-30'] += 1;
    else ageBuckets.other += 1;
  });

  const visitsOverTime = Object.keys(visitsMap).sort().map((date) => ({ date, visits: visitsMap[date] }));
  const ageDistribution = Object.entries(ageBuckets).map(([key, count]) => ({ _id: key, count }));
  const birthdayMonths = Object.keys(birthdayMonthMap).sort((a, b) => Number(a) - Number(b)).map((k) => ({ _id: Number(k), count: birthdayMonthMap[k] }));

  res.json({
    metrics: {
      totalCustomers,
      uniqueCustomers: totalCustomers,
      totalVisits,
      weeklyVisits,
      monthlyVisits,
      upcomingBirthdays7Days: inNext7,
      upcomingBirthdaysThisMonth: inThisMonth
    },
    charts: { visitsOverTime, ageDistribution, birthdayMonths }
  });
};

module.exports = { dashboardStats };
