export default function MetricCards({ metrics }) {
  const entries = [
    ['Total Customers', metrics.totalCustomers],
    ['Unique Customers', metrics.uniqueCustomers],
    ['Total Visits', metrics.totalVisits],
    ['Weekly Visits', metrics.weeklyVisits],
    ['Monthly Visits', metrics.monthlyVisits],
    ['Upcoming Birthdays (7 days)', metrics.upcomingBirthdays7Days],
    ['Upcoming Birthdays (This month)', metrics.upcomingBirthdaysThisMonth]
  ];

  return (
    <div className="row g-3 mb-4">
      {entries.map(([label, value]) => (
        <div className="col-md-3" key={label}>
          <div className="card card-metric h-100">
            <div className="card-body">
              <div className="text-muted small">{label}</div>
              <h4 className="mb-0">{value ?? 0}</h4>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
