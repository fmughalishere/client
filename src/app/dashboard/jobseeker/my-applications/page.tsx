"use client";
import { useEffect, useState, useRef } from "react";
import { 
  Briefcase, ArrowLeft, Loader2, 
  ChevronRight, ChevronDown, Filter,
  Check, PartyPopper, Search, FileText
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isDropOpen, setIsDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://easyjobspk.onrender.com/api/applications/my-applications", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setApps(data);
      } catch (err) { console.log(err) }
      finally { setLoading(false) }
    };
    fetchApps();
  }, []);

  const filterOptions = ["all", "pending", "shortlisted", "offered", "approved", "rejected"];

  const filteredApps = apps.filter((app: any) => {
    if (filter === "all") return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'offered': 
      case 'approved': return "bg-[#5DBB63] text-white";
      case 'shortlisted': return "bg-purple-600 text-white";
      case 'rejected': return "bg-red-500 text-white";
      default: return "bg-blue-100 text-[#00004d]";
    }
  };

  return (
    <div className="min-h-screen bg-[#e6e8e8] pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/dashboard/jobseeker" className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-4 hover:text-[#00004d] transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO DASHBOARD
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-[#00004d] tracking-tight">My Applications</h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Track your job & general applications 🚀</p>
            </div>
                        <div className="relative w-full md:w-64" ref={dropRef}>
              <button 
                onClick={() => setIsDropOpen(!isDropOpen)}
                className="w-full bg-white border-2 border-slate-100 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-[#00004d]" />
                  <span className="font-black text-[#00004d] text-xs uppercase">{filter}</span>
                </div>
                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isDropOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border rounded-[2rem] shadow-2xl z-50 p-2 overflow-hidden">
                    {filterOptions.map((opt) => (
                      <button key={opt} onClick={() => {setFilter(opt); setIsDropOpen(false)}} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs capitalize ${filter === opt ? 'bg-[#00004d] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00004d]" size={40} /></div>
        ) : (
          <div className="grid gap-4">
            {filteredApps.map((app: any, i: number) => (
              <motion.div key={app._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${app.job ? 'bg-slate-100 text-[#00004d]' : 'bg-green-50 text-[#5DBB63]'}`}>
                      {app.job ? <Briefcase size={26} /> : <FileText size={26} />}
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                        {app.job ? "Job-Specific" : "General Application"}
                      </span>
                      <h4 className="text-lg md:text-xl font-black text-[#00004d] leading-tight">
                        {app.job?.title || "Platform Application"}
                      </h4>
                      <p className="text-[#5DBB63] font-black text-[10px] uppercase tracking-widest mt-1">
                        {app.job?.companyName || "Easy Jobs PK"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Status</p>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(app.status)}`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    <Link href={`/dashboard/jobseeker/my-applications/${app._id}`} className="w-12 h-12 bg-[#00004d] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}