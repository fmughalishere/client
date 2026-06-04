"use client";
import { useEffect, useState } from "react";
import { Bookmark, Briefcase, MapPin, Loader2, ArrowLeft, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { jobAPI } from "../../../../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await jobAPI.getSavedJobs();
      setSavedJobs(res.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) toast.error("Session expired.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSavedJobs(); }, []);

  const handleRemove = async (jobId: string) => {
    try {
      await jobAPI.toggleSaveJob(jobId);
      toast.success("Removed from saved");
      setSavedJobs(savedJobs.filter((job: any) => job._id !== jobId));
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="min-h-screen bg-[#e6e8e8] font-sans pb-20">
      <Toaster position="top-center" />
      <div className="bg-white px-6 py-6 rounded-b-[40px] shadow-sm mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard/jobseeker" className="p-2 bg-slate-50 rounded-full text-[#00004d]">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-black text-[#00004d]  tracking-tighter">Saved Jobs</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-[#00004d] tracking-tighter   leading-none">
              My <span className="text-[#5DBB63]">Wishlist</span>
            </h2>
            <p className="text-slate-500 font-bold text-[11px]  tracking-widest mt-2">
              {savedJobs.length} Positions Shortlisted
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-[#00004d]" size={40} />
            <p className="text-[#00004d] font-black text-[10px] tracking-widest ">Fetching...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.length > 0 ? (
              savedJobs.map((job: any) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={job._id}
                  className="bg-white p-5 md:p-8 rounded-[2.5rem] border border-white flex flex-col md:flex-row items-center gap-6 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 h-full w-2 bg-[#5DBB63] opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="w-16 h-16 bg-[#00004d]/5 rounded-[1.5rem] flex items-center justify-center text-[#00004d] shrink-0">
                    <Briefcase size={28} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black text-[#00004d] tracking-tight truncate max-w-[250px] md:max-w-none">
                      {job.category || job.title}
                    </h4>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2 text-slate-400 font-black text-[9px]  tracking-widest">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-[#5DBB63]" /> {job.city}</span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <span className="text-[#5DBB63]">{job.salary || "Negotiable"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="flex-1 md:flex-none px-6 py-4 bg-[#00004d] text-white rounded-2xl font-black text-[10px]  tracking-widest text-center shadow-lg active:scale-95 transition-all"
                    >
                      View Job
                    </Link>
                    <button
                      onClick={() => handleRemove(job._id)}
                      className="p-4 bg-white text-[#00004d] rounded-2xl hover:bg-[#00004d] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-12 md:p-24 rounded-[3.5rem] text-center shadow-sm border border-white">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <Bookmark className="text-[#00004d]/20" size={32} />
                </div>
                <h3 className="text-[#00004d] font-black text-2xl mb-2 tracking-tighter  ">
                  List is <span className="text-[#5DBB63]">Empty</span>
                </h3>
                <p className="font-bold text-slate-400 text-[11px]  tracking-widest mb-10 max-w-[200px] mx-auto">
                  Start saving jobs you're interested in.
                </p>
                <Link
                  href="/jobs"
                  className="inline-block w-full sm:w-auto bg-[#5DBB63] text-white px-12 py-5 rounded-[2rem] font-black text-[11px]  tracking-widest shadow-xl shadow-[#5DBB63]/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Explore Jobs
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}