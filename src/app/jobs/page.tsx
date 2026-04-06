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
  AlertCircle,
  ArrowLeft
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
    <main className="min-h-screen bg-[#fcfcfc] pb-20">
            <section className="bg-[#e2f2f5] pt-10 pb-20 px-6 rounded-b-[50px] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] md:text-xs tracking-widest hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>

          <div className="text-center mb-10">
             <h1 className="text-3xl md:text-5xl font-black text-[#00004d] mb-4">Find Your Next <span className="text-[#00d26a]">Opportunity</span></h1>
             <p className="text-[#00004d]/60 font-bold text-sm md:text-lg uppercase tracking-widest">Explore live jobs across Pakistan</p>
          </div>
          <div className="max-w-4xl mx-auto bg-white p-2 md:p-3 rounded-full shadow-2xl border border-[#e2f2f5] flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full">
              <Search className="text-[#00004d]" size={20} />
              <input 
                type="text" 
                placeholder="Job Title..." 
                className="w-full outline-none font-bold text-[#00004d] text-sm md:text-base placeholder:text-gray-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-[1px] h-8 bg-gray-100"></div>
            <div className="flex-1 flex items-center gap-3 px-6 py-2 md:py-0 w-full">
              <MapPin className="text-[#00d26a]" size={20} />
              <input 
                type="text" 
                placeholder="City Name..." 
                className="w-full outline-none font-bold text-[#00004d] text-sm md:text-base placeholder:text-gray-300"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchJobs}
              className="bg-[#00004d] text-white px-8 py-3 md:py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95 w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-gray-50 shadow-sm sticky top-32">
            <h3 className="text-[#00004d] font-black text-lg mb-8 flex items-center gap-2 uppercase tracking-tight">
              <Filter size={20} className="text-[#00d26a]" /> Filter Jobs
            </h3>
            
            <div className="space-y-4">
              {['Full-time', 'Part-time', 'Remote', 'Contract', 'One Day Task'].map(type => (
                <label key={type} className="flex items-center gap-4 py-1 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[#00d26a] rounded-md cursor-pointer" />
                  <span className="text-gray-500 font-bold text-sm group-hover:text-[#00004d] transition-colors">{type}</span>
                </label>
              ))}
            </div>
            <div className="mt-12 p-8 bg-[#00004d] rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d26a]/10 rounded-full -mr-12 -mt-12"></div>
                <h4 className="font-black text-base leading-tight mb-4 relative z-10">Hire Talent Faster!</h4>
                <p className="text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest opacity-60">Post your job here</p>
                <Link href="/dashboard/employer" className="text-xs font-black text-[#00d26a] uppercase flex items-center gap-1 hover:underline">
                    Get Started <ChevronRight size={14} />
                </Link>
            </div>
          </div>
        </aside>
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl md:text-2xl font-black text-[#00004d] uppercase tracking-tight">
              {search || cityFilter ? "Results" : "Latest Vacancies"} 
              <span className="text-gray-300 font-black ml-3 text-sm md:text-lg">({jobs.length})</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading Jobs...</p>
              </motion.div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                {jobs.map((job: any) => (
                  <motion.div 
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 bg-[#e2f2f5] rounded-2xl flex items-center justify-center shrink-0 border border-[#e2f2f5] group-hover:bg-[#00004d] group-hover:text-white transition-all">
                        <Briefcase size={28} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-black text-[#00004d] group-hover:text-[#00d26a] transition-colors leading-tight cursor-pointer">
                          <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-[#00d26a] font-black text-xs md:text-sm uppercase tracking-tight">{job.company}</p>
                                                <div className="flex flex-wrap gap-2 pt-4">
                          <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-gray-500 bg-slate-50 px-4 py-2 rounded-full border border-gray-50 uppercase">
                            <MapPin size={12} className="text-[#00004d]" /> {job.city || job.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-gray-500 bg-slate-50 px-4 py-2 rounded-full border border-gray-50 uppercase">
                            <DollarSign size={12} className="text-[#00004d]" /> {job.salary || "Negotiable"}
                          </span>
                          <span className="text-[9px] md:text-[10px] font-black text-[#00004d] bg-[#00d26a]/10 border border-[#00d26a]/20 px-4 py-2 rounded-full uppercase tracking-widest">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-gray-50">
                      <span className="text-[10px] font-black text-gray-300 uppercase flex items-center gap-1 tracking-widest">
                        <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <Link 
                        href={`/jobs/${job._id}`} 
                        className="w-full md:w-auto bg-[#00004d] text-white px-8 py-4 rounded-full font-black text-xs md:text-sm hover:bg-[#00d26a] hover:text-[#00004d] transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
                      >
                        Details <ChevronRight size={18} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
              >
                <AlertCircle className="text-orange-300 mx-auto mb-4" size={56} />
                <h3 className="text-xl font-black text-[#00004d] uppercase">No Jobs Found</h3>
                <p className="text-gray-400 font-bold mt-2 text-sm">Try different keywords or check other cities.</p>
                <button 
                    onClick={() => {setSearch(""); setCityFilter("");}}
                    className="mt-6 text-[#00d26a] font-black uppercase text-[10px] hover:underline tracking-widest"
                >
                    Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}