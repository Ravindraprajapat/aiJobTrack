import { Briefcase, Clock, ThumbsUp, XCircle } from "lucide-react";

interface Props {
  applications: any[];
}

const ApplicationStats = ({ applications }: Props) => {
  const total = applications.length;
  const active = applications.filter(a => ["Applied", "Phone Screen", "Interview"].includes(a.status)).length;
  const offers = applications.filter(a => a.status === "Offer").length;
  const rejections = applications.filter(a => a.status === "Rejected").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      
      <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors">
        <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-lg text-blue-600 dark:text-blue-400">
          <Briefcase size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Total Apps</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{total}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors">
        <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-lg text-amber-600 dark:text-amber-400">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Active</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{active}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors">
        <div className="bg-green-100 dark:bg-green-500/20 p-3 rounded-lg text-green-600 dark:text-green-400">
          <ThumbsUp size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Offers</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{offers}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 flex items-center gap-4 transition-colors">
        <div className="bg-red-100 dark:bg-red-500/20 p-3 rounded-lg text-red-600 dark:text-red-400">
          <XCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Rejected</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{rejections}</p>
        </div>
      </div>

    </div>
  );
};

export default ApplicationStats;
