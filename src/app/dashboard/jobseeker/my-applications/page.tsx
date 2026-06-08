"use client";
import { useEffect, useState, useRef } from "react";
import {
  Briefcase, ArrowLeft, Loader2,
  ChevronRight, ChevronDown, Filter,
  FileText, MapPin, GraduationCap, Calendar, CheckCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MyApplications() {
const [apps, setApps] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState("all");
const [isDropOpen, setIsDropOpen] = useState(false);
const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setIsDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://easyjobspk.onrender.com/api/applications/my-applications", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log("Raw Applicant Data Response:", data);
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching applicant records:", err);
      } finally {
        setLoading(false);
      }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "N/A";
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
                      <button key={opt} onClick={() => { setFilter(opt); setIsDropOpen(false) }} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-xs capitalize ${filter === opt ? 'bg-[#00004d] text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
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
          <div className="grid gap-6">
            {filteredApps.length > 0 ? (
              filteredApps.map((app: any, i: number) => {
                const targetJob = app.jobId || app.job;
                const hasJob = !!targetJob;

                return (
                  <motion.div 
                    key={app._id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }} 
                    className="bg-white p-5 md:p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
                        <div className="flex items-center gap-4">
                          {!hasJob && app.image && app.image.startsWith('data:image') ? (
                            <img 
                              src={app.image} 
                              alt={app.fullName || "User Profile"} 
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0"
                            />
                          ) : (
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${hasJob ? 'bg-indigo-50 text-[#00004d]' : 'bg-emerald-50 text-[#5DBB63]'}`}>
                              {hasJob ? <Briefcase size={24} /> : <FileText size={24} />}
                            </div>
                          )}
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">
                              {hasJob ? "Job-Specific Application" : "Platform General Application"}
                            </span>
                            <h4 className="text-lg font-black text-[#00004d] leading-tight">
                              {hasJob
                                ? (targetJob.designation || targetJob.title || "Job Position")
                                : (app.category ? `${app.category}` : "Platform Application")
                              }
                            </h4>
                            <p className="text-[#5DBB63] font-bold text-xs mt-0.5">
                              {hasJob ? (targetJob.companyName || "Specified Company") : (app.fullName || "Easy Jobs PK Profile")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-start sm:flex-col sm:items-end gap-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block sm:hidden">Status:</span>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-xs font-medium text-slate-600">
                        {app.city && (
                          <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/50">
                            <MapPin size={15} className="text-slate-400 shrink-0" />
                            <span className="truncate">{app.city}{app.country ? `, ${app.country}` : ''}</span>
                          </div>
                        )}
                        {app.education && (
                          <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/50">
                            <GraduationCap size={15} className="text-slate-400 shrink-0" />
                            <span className="truncate" title={app.education}>{app.education}</span>
                          </div>
                        )}
                        {app.jobtype && (
                          <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/50">
                            <Clock size={15} className="text-slate-400 shrink-0" />
                            <span>{app.jobtype}</span>
                          </div>
                        )}
                        {!hasJob && (
                          <div className="flex items-center gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/50 sm:col-span-2 md:col-span-1">
                            <CheckCircle size={15} className="text-slate-400 shrink-0" />
                            <span>{app.isFresher ? 'Fresher Candidate' : 'Experienced Pro'}</span>
                          </div>
                        )}
                      </div>
                      {!hasJob && app.skills && app.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {app.skills.map((skill: string, index: number) => (
                            <span key={index} className="bg-slate-100 font-bold text-slate-500 text-[10px] px-2.5 py-1 rounded-lg">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Calendar size={14} />
                        <span>Submitted: {formatDate(app.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {!hasJob && app.salaryDemand && (
                          <span className="text-[#00004d] font-bold bg-slate-100 text-xs px-3 py-1.5 rounded-xl">
                            {app.salaryDemand}
                          </span>
                        )}
                        <Link 
                          href={`/dashboard/jobseeker/my-applications/${app._id}`} 
                          className="w-10 h-10 bg-[#00004d] rounded-xl flex items-center justify-center text-white hover:bg-opacity-90 active:scale-95 transition-all shadow-md"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-300">
                <p className="font-bold text-slate-400 text-sm">No recent applications found under this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}