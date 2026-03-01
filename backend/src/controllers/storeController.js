const Customer = require('../models/Customer');
const MessageTemplate = require('../models/MessageTemplate');

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getDashboard = async (req, res) => {
  const { storeId } = req.params;
  const totalCustomers = await Customer.countDocuments({ store_id: storeId });
  const totalVisitsAgg = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $group: { _id: null, total: { $sum: '$visit_count' } } }
  ]);

  const today = startOfDay(new Date());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const [weeklyVisits, monthlyVisits] = await Promise.all([
    Customer.aggregate([{ $match: { store_id: storeId, modified_datetime: { $gte: weekAgo } } }, { $group: { _id: null, total: { $sum: '$visit_count' } } }]),
    Customer.aggregate([{ $match: { store_id: storeId, modified_datetime: { $gte: monthAgo } } }, { $group: { _id: null, total: { $sum: '$visit_count' } } }])
  ]);

  const ageDistribution = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $bucket: { groupBy: '$age', boundaries: [0, 18, 21, 24, 30, 45, 100], default: 'other', output: { count: { $sum: 1 } } } }
  ]);

  const visitsOverTime = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$modified_datetime' } }, visits: { $sum: '$visit_count' } } },
    { $sort: { _id: 1 } }
  ]);

  const birthdayByMonth = await Customer.aggregate([
    { $match: { store_id: storeId } },
    { $group: { _id: { $month: '$date_of_birth' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  const next7 = new Date(today);
  next7.setDate(next7.getDate() + 7);
  const customers = await Customer.find({ store_id: storeId }, { date_of_birth: 1 });
  const currentYear = today.getFullYear();
  const upcoming7 = customers.filter((c) => {
    const dob = new Date(c.date_of_birth);
    const d = new Date(currentYear, dob.getMonth(), dob.getDate());
    return d >= today && d <= next7;
  }).length;

  const thisMonth = customers.filter((c) => new Date(c.date_of_birth).getMonth() === today.getMonth()).length;

  const templates = await MessageTemplate.find({ store_id: storeId }).sort({ updatedAt: -1 });

  res.json({
    metrics: {
      totalCustomers,
      uniqueCustomers: totalCustomers,
      totalVisits: totalVisitsAgg[0]?.total || 0,
      weeklyVisits: weeklyVisits[0]?.total || 0,
      monthlyVisits: monthlyVisits[0]?.total || 0,
      upcomingBirthdays7Days: upcoming7,
      upcomingBirthdaysThisMonth: thisMonth
    },
    charts: {
      visitsOverTime: visitsOverTime.map((v) => ({ date: v._id, visits: v.visits })),
      ageDistribution: ageDistribution.map((a) => ({ bucket: `${a._id}`, count: a.count })),
      birthdayMonthDistribution: birthdayByMonth.map((m) => ({ month: m._id, count: m.count }))
    },
    templates
  });
};

module.exports = { getDashboard };
