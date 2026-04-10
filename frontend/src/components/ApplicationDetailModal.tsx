import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteApplication, updateApplication } from "../redux/applicationSlice";
import { serverUrl } from "../App";
import { Copy, Check, CalendarIcon } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  app: any;
}

const ApplicationDetailModal = ({ open, setOpen, app }: Props) => {
  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(app);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!open) return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${serverUrl}/api/application/${app._id}`, {
        withCredentials: true,
      });
      dispatch(deleteApplication(app._id));
      setOpen(false);
    } catch (error) {
      console.log("Delete error", error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${serverUrl}/api/application/${app._id}`,
        editForm,
        { withCredentials: true }
      );
      dispatch(updateApplication(res.data));
      setIsEditing(false);
    } catch (error) {
      console.log("Update error", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all" onClick={() => setOpen(false)}>
      <div 
        className="bg-white dark:bg-[#0f172a] p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-800 dark:text-white shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Application" : "Application Details"}
          </h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">✕</button>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Company</p><p className="font-semibold text-lg">{app.company}</p></div>
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Role</p><p className="font-semibold text-lg">{app.role}</p></div>
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Status</p><p className="bg-amber-100 dark:bg-amber-400/20 text-amber-700 dark:text-amber-400 font-medium inline-block px-2 py-1 rounded mt-1">{app.status}</p></div>
              
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Next Follow-up Goal</p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon size={16} className={app.reminderDate && new Date(app.reminderDate) <= new Date() ? "text-red-500" : "text-amber-500"} />
                  <p className={app.reminderDate && new Date(app.reminderDate) <= new Date() ? "text-red-500 font-bold" : ""}>
                    {app.reminderDate ? new Date(app.reminderDate).toLocaleDateString() : "No reminder set"}
                  </p>
                </div>
              </div>

              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Date Applied</p><p>{new Date(app.dateApplied || app.date || Date.now()).toLocaleDateString()}</p></div>
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Seniority</p><p>{app.seniority || "N/A"}</p></div>
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Location</p><p>{app.location || "N/A"}</p></div>
              <div><p className="text-sm font-medium text-slate-500 dark:text-gray-400">Salary Range</p><p>{app.salaryRange || "N/A"}</p></div>
              
              {app.jdLink && (
                <div className="col-span-2"><p className="text-sm font-medium text-slate-500 dark:text-gray-400">JD Link</p>
                  <a href={app.jdLink} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline break-all">{app.jdLink}</a>
                </div>
              )}
            </div>

            {app.skills?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {app.skills.map((s: string) => <span key={s} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full text-sm">{s}</span>)}
                </div>
              </div>
            )}

            {app.notes && (
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">{app.notes}</p>
              </div>
            )}

            {app.suggestions?.length > 0 && (
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-500 dark:text-amber-400">✨ Resume Bullet Point Suggestions</h3>
                <div className="space-y-3">
                  {app.suggestions.map((sug: string, i: number) => (
                    <div key={i} className="flex gap-3 justify-between items-start bg-amber-50/50 dark:bg-slate-800/50 p-4 rounded-lg border border-amber-100 dark:border-slate-700 hover:border-amber-400/50 dark:hover:border-slate-500 transition-colors">
                      <p className="text-sm flex-1 leading-relaxed">{sug}</p>
                      <button 
                        onClick={() => copyToClipboard(sug, i)}
                        className="text-slate-400 hover:text-amber-500 dark:hover:text-white p-2 rounded-md hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === i ? <Check size={18} className="text-green-500 dark:text-green-400"/> : <Copy size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setIsEditing(true)} className="flex-1 bg-blue-50 dark:bg-blue-500 hover:bg-blue-100 dark:hover:bg-blue-600 text-blue-600 dark:text-white font-medium px-4 py-2 rounded-lg border border-blue-200 dark:border-transparent transition-colors">Edit Tracking Info</button>
              <button onClick={handleDelete} className="bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500 text-red-600 dark:text-red-500 hover:dark:text-white font-medium px-6 py-2 rounded-lg border border-red-200 dark:border-transparent transition-colors">Delete Entry</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Company</label>
                <input value={editForm.company || ""} onChange={e => setEditForm({...editForm, company: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Role</label>
                <input value={editForm.role || ""} onChange={e => setEditForm({...editForm, role: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Next Follow-up Goal</label>
                <input type="date" value={editForm.reminderDate ? new Date(editForm.reminderDate).toISOString().split('T')[0] : ""} onChange={e => setEditForm({...editForm, reminderDate: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Location</label>
                <input value={editForm.location || ""} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Salary Range</label>
                <input value={editForm.salaryRange || ""} onChange={e => setEditForm({...editForm, salaryRange: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" placeholder="e.g. $100k - $120k" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Status Tracking</label>
                <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1">
                  <option>Applied</option>
                  <option>Phone Screen</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">JD Link URL</label>
                <input value={editForm.jdLink || ""} onChange={e => setEditForm({...editForm, jdLink: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Meeting Notes</label>
                <textarea value={editForm.notes || ""} onChange={e => setEditForm({...editForm, notes: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1 min-h-[100px]" />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button disabled={loading} onClick={handleUpdate} className="flex-1 bg-amber-400 text-black font-semibold hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                {loading ? "Revising Tracking..." : "Persist Changes"}
              </button>
              <button onClick={() => { setIsEditing(false); setEditForm(app); }} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-2 rounded-lg transition-colors">Abort</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
