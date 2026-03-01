export default function MetricCard({ title, value }) {
  return (
    <div className="col-md-4 mb-3">
      <div className="card card-metric h-100">
        <div className="card-body">
          <p className="text-muted mb-1">{title}</p>
          <h4>{value}</h4>
        </div>
      </div>
    </div>
  );
}
