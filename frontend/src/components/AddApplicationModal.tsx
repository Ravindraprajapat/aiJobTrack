import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addApplication } from "../redux/applicationSlice";
import { serverUrl } from "../App";
import { Loader2, Copy, Check, Sparkles, FileText, Brain } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AddApplicationModal = ({ open, setOpen }: Props) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState<"PARSE" | "LOADING" | "SUGGESTIONS" | "FORM">("PARSE");
  const [jdText, setJdText] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingMsg, setLoadingMsg] = useState("Reading job description...");

  const [formData, setFormData] = useState<any>({
    company: "", role: "", seniority: "", location: "",
    salaryRange: "", jdLink: "", notes: "", status: "Applied",
    skills: [], niceToHaveSkills: [], suggestions: [], jdText: ""
  });

  if (!open) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleParse = async () => {
    if (!jdText.trim()) return alert("Please paste a Job Description first.");

    setStep("LOADING");
    setErrorDetails("");

    // Animate loading messages
    const msgs = [
      "Reading job description...",
      "Extracting company & role...",
      "Identifying required skills...",
      "Generating resume bullet points...",
      "Almost done...",
    ];
    let i = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 1200);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/application/parse`,
        { jdText },
        { withCredentials: true }
      );

      clearInterval(interval);
      console.log("AI RESPONSE:", data);

      const filled = {
        company: data.company || "",
        role: data.role || "",
        seniority: data.seniority || "",
        location: data.location || "",
        salaryRange: data.salaryRange || "",
        jdLink: "",
        notes: "",
        status: "Applied",
        skills: data.skills || [],
        niceToHaveSkills: data.niceToHaveSkills || [],
        suggestions: data.suggestions || [],
        jdText,
      };

      setFormData(filled);
      setSuggestions(data.suggestions || []);
      setStep("SUGGESTIONS");

    } catch (err: any) {
      clearInterval(interval);
      console.log("Parse error:", err);
      setErrorDetails("AI parsing failed. Please fill the form manually.");
      setStep("FORM");
    }
  };

  const handleSave = async () => {
    if (!formData.company || !formData.role) return alert("Company and Role are required.");
    try {
      setSaving(true);
      const res = await axios.post(
        `${serverUrl}/api/application/createApplication`,
        formData,
        { withCredentials: true }
      );
      dispatch(addApplication(res.data));
      handleClose();
    } catch (err) {
      console.log("Save error", err);
      setErrorDetails("Failed to save application.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setJdText("");
    setStep("PARSE");
    setErrorDetails("");
    setSuggestions([]);
    setFormData({
      company: "", role: "", seniority: "", location: "",
      salaryRange: "", jdLink: "", notes: "", status: "Applied",
      skills: [], niceToHaveSkills: [], suggestions: [], jdText: ""
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={handleClose}>
      <div
        className="bg-white dark:bg-[#0f172a] p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-800 dark:text-white shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Create Application</h2>

        {errorDetails && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-rose-950/40 border border-red-300 dark:border-rose-900/50 text-red-700 dark:text-red-200 rounded">
            {errorDetails}
          </div>
        )}

        {/* STEP 1: Paste JD */}
        {step === "PARSE" && (
          <div className="space-y-4">
            <p className="text-slate-500 dark:text-gray-400 text-sm">Paste the Job Description below. AI will extract all details and generate resume bullet points automatically.</p>
            <textarea
              placeholder="Paste Job Description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full min-h-[200px] p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-400 transition-colors"
            />
            <div className="flex gap-3">
              <button onClick={handleParse} className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-semibold px-4 py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                <Sparkles size={16} /> Extract details with MNC AI
              </button>
              <button onClick={() => setStep("FORM")} className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Skip AI
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Animated Loader */}
        {step === "LOADING" && (
          <div className="flex flex-col items-center justify-center py-12 gap-6">
            {/* Animated icon ring */}
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-100 dark:border-amber-900/30" />
              <div className="absolute w-20 h-20 rounded-full border-4 border-transparent border-t-amber-400 animate-spin" />
              <div className="absolute">
                <Brain size={28} className="text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Animated steps */}
            <div className="flex flex-col items-center gap-2">
              <p className="font-semibold text-amber-500 dark:text-amber-400 text-sm uppercase tracking-wider transition-all">
                {loadingMsg}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Powered by Gemini AI</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-amber-400"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>

            {/* What's being extracted */}
            <div className="flex gap-4 mt-2">
              {[
                { icon: <FileText size={14} />, label: "JD Details" },
                { icon: <Sparkles size={14} />, label: "Skills" },
                { icon: <Brain size={14} />, label: "Resume Bullets" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  {icon} {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: AI Suggestions */}
        {step === "SUGGESTIONS" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-amber-500 dark:text-amber-400">✨ Resume Bullet Point Suggestions</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">{suggestions.length} points generated</span>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((sug, i) => (
                  <div key={i} className="flex gap-3 justify-between items-start bg-amber-50/50 dark:bg-slate-800/50 p-4 rounded-lg border border-amber-100 dark:border-slate-700 hover:border-amber-400/50 dark:hover:border-slate-500 transition-colors">
                    <p className="text-sm flex-1 leading-relaxed">{sug}</p>
                    <button
                      onClick={() => copyToClipboard(sug, i)}
                      className="text-slate-400 hover:text-amber-500 dark:hover:text-white p-2 rounded-md hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === i ? <Check size={18} className="text-green-500 dark:text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No suggestions generated.</p>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setStep("FORM")} className="flex-1 bg-amber-400 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded transition-colors">
                Continue to Form →
              </button>
              <button onClick={handleClose} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-2 rounded transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* STEP 4: Auto-filled Form */}
        {step === "FORM" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Company *</label>
                <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Role *</label>
                <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Seniority</label>
                <input value={formData.seniority} onChange={e => setFormData({...formData, seniority: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Location</label>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Salary Range</label>
                <input value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" placeholder="e.g. $100k - $120k" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">JD Link</label>
                <input value={formData.jdLink} onChange={e => setFormData({...formData, jdLink: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1" placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Notes (Optional)</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 mt-1 min-h-[80px]" />
              </div>
            </div>

            {formData.suggestions?.length > 0 && (
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-3 text-amber-500 dark:text-amber-400">✨ Resume Bullet Point Suggestions</h3>
                <div className="space-y-3">
                  {formData.suggestions.map((sug: string, i: number) => (
                    <div key={i} className="flex gap-3 justify-between items-start bg-amber-50/50 dark:bg-slate-800/50 p-4 rounded-lg border border-amber-100 dark:border-slate-700 hover:border-amber-400/50 dark:hover:border-slate-500 transition-colors">
                      <p className="text-sm flex-1 leading-relaxed">{sug}</p>
                      <button
                        onClick={() => copyToClipboard(sug, i)}
                        className="text-slate-400 hover:text-amber-500 dark:hover:text-white p-2 rounded-md hover:bg-amber-100 dark:hover:bg-slate-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === i ? <Check size={18} className="text-green-500 dark:text-green-400" /> : <Copy size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button disabled={saving} onClick={handleSave} className="flex-1 bg-amber-400 text-black font-semibold hover:bg-amber-500 px-4 py-2 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Application"}
              </button>
              <button onClick={handleClose} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 px-6 py-2 rounded transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddApplicationModal;
