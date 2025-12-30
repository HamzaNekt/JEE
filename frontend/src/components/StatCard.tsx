type StatCardProps = {
  label: string;
  value: string | number;
  trend?: string;
};

export const StatCard = ({ label, value, trend }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
        {trend && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
    </div>
  );
};

