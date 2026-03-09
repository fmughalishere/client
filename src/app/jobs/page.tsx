"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "../../lib/axios";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Filter, 
  Loader2, 
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs?title=${search}&city=${cityFilter}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, cityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-block text-[#00d26a] font-black uppercase text-sm hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="mb-4 bg-white p-4 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="text-[#1e3a8a]" size={20} />
          <input 
            type="text" 
            placeholder="Search by Job Title..." 
            className="w-full outline-none font-bold text-[#1e3a8a] py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="hidden md:block w-[1px] h-10 bg-slate-100"></div>
        <div className="flex-1 flex items-center gap-3 px-4">
          <MapPin className="text-[#00d26a]" size={20} />
          <input 
            type="text" 
            placeholder="City (e.g. Lahore)..." 
            className="w-full outline-none font-bold text-[#1e3a8a] py-2"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-32">
            <h3 className="text-[#1e3a8a] font-black text-xl mb-6 flex items-center gap-2">
              <Filter size={20} className="text-[#00d26a]" /> Filter by Type
            </h3>
            
            <div className="space-y-4">
              {['One Day Task', 'Part-time', 'Full-time', 'Remote', 'Contract'].map(type => (
                <label key={type} className="flex items-center gap-3 py-1 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[#00d26a] rounded-lg border-2" />
                  <span className="text-gray-500 font-bold group-hover:text-[#1e3a8a] transition-colors">{type}</span>
                </label>
              ))}
            </div>

            <div className="mt-10 p-6 bg-[#1e3a8a] rounded-3xl text-white">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Advertisement</p>
                <h4 className="font-bold leading-tight mb-4">Post your job here and hire talent faster!</h4>
                <Link href="/dashboard/employer" className="text-xs font-black text-[#00d26a] uppercase flex items-center gap-1">
                    Post a job <ChevronRight size={14} />
                </Link>
            </div>
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-[#1e3a8a]">
              {search || cityFilter ? "Search Results" : "Latest Opportunities"} 
              <span className="text-gray-300 font-bold ml-2">({jobs.length})</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="animate-spin text-[#1e3a8a] mb-4" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Fetching Live Jobs...</p>
              </motion.div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job: any) => (
                  <motion.div 
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                        <Briefcase className="text-[#1e3a8a]" size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#1e3a8a] hover:text-[#00d26a] transition-colors leading-tight">
                          <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-[#00d26a] font-extrabold text-sm">{job.company}</p>
                        <div className="flex flex-wrap gap-4 pt-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <MapPin size={14} className="text-[#1e3a8a]" /> {job.city}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <DollarSign size={14} className="text-[#1e3a8a]" /> {job.salary || "Not Specified"}
                          </span>
                          <span className="text-[10px] font-black text-[#1e3a8a] bg-[#00d26a]/10 border border-[#00d26a]/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1 tracking-widest">
                        <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <Link 
                        href={`/jobs/${job._id}`} 
                        className="w-full md:w-auto bg-[#1e3a8a] text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-blue-900 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
                      >
                        Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
              >
                <AlertCircle className="text-orange-300 mx-auto mb-4" size={56} />
                <h3 className="text-xl font-black text-[#1e3a8a]">No Jobs Found</h3>
                <p className="text-gray-400 font-bold mt-2">Try adjusting your filters or search terms.</p>
                <button 
                    onClick={() => {setSearch(""); setCityFilter("");}}
                    className="mt-6 text-[#00d26a] font-black uppercase text-xs hover:underline"
                >
                    Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}