import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import ApplicationDetailModal from "./ApplicationDetailModal";
import { MapPin, Briefcase } from "lucide-react";

interface Props {
  app: any;
  index: number;
}

const Card = ({ app, index }: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const isOverdue = app.reminderDate && new Date(app.reminderDate) <= new Date();

  return (
    <>
      <Draggable draggableId={app._id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-4 mb-3 rounded-xl border transition-all shadow-sm ${
              isOverdue 
                ? "bg-red-50 dark:bg-rose-950/30 border-red-200 dark:border-rose-900/50 hover:border-red-400 dark:hover:border-rose-500" 
                : "bg-white dark:bg-[#020617] border-slate-200 dark:border-white/10 hover:border-amber-400/50 shadow-slate-200/50 dark:shadow-none"
            }`}
          >
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{app.company}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-1 mb-3">{app.role}</p>

            {/* 🔥 MNC Professional Display for Extracted AI Params */}
            <div className="flex flex-col gap-2 mb-3">
              {(app.location || app.seniority) && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-gray-400 font-medium">
                  {app.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {app.location}
                    </span>
                  )}
                  {app.seniority && (
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {app.seniority}
                    </span>
                  )}
                </div>
              )}

              {/* Skills Display (Max 3 to keep UI clean) */}
              {app.skills && app.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {app.skills.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded border border-blue-100 dark:border-transparent">
                      {skill}
                    </span>
                  ))}
                  {app.skills.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">+{app.skills.length - 3}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded text-slate-600 dark:text-gray-300">
                {new Date(app.dateApplied || app.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}
              </span>
              
              <div className="flex items-center gap-2">
                {isOverdue && (
                  <span className="text-[10px] font-bold text-red-600 dark:text-rose-400 bg-red-100 dark:bg-rose-900/40 px-2 py-1 rounded-full animate-pulse shadow-sm">
                    FOLLOW UP
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModal(true);
                  }}
                  className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold rounded shadow-sm hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                >
                  View / Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {openModal && (
        <ApplicationDetailModal
          open={openModal}
          setOpen={setOpenModal}
          app={app}
        />
      )}
    </>
  );
};

export default Card;