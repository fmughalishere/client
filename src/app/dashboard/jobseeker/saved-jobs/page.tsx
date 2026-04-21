"use client";
import { useEffect, useState } from "react";
import { Bookmark, Briefcase, MapPin, Trash2, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { jobAPI } from "../../../../services/apiService";
import toast, { Toaster } from "react-hot-toast";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSavedJobs = async () => {
    try {
      const res = await jobAPI.getSavedJobs();
      setSavedJobs(res.data || []);
    } catch (err: any) {
      console.error("Error fetching saved jobs:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);
  const handleRemove = async (jobId: string) => {
    try {
      await jobAPI.toggleSaveJob(jobId);
      toast.success("Job removed from saved list");
      setSavedJobs(savedJobs.filter((job: any) => job._id !== jobId));
    } catch (err) {
      toast.error("Failed to remove job");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-16">
      <Toaster position="top-center" />
            <Link 
        href="/dashboard/jobseeker" 
        className="inline-flex items-center gap-2 text-slate-400 font-black text-[11px]  tracking-[0.15em] mb-10 hover:text-[#1e3a8a] transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-all">
          <ArrowLeft size={16} />
        </div>
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#1e3a8a] tracking-tighter  italic">
            Saved <span className="text-blue-400">Opportunities</span>
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Manage all your shortlisted career paths in one place.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           <span className="text-[#1e3a8a] font-black text-xl">{savedJobs.length}</span>
           <span className="text-slate-400 font-bold text-[10px]  ml-2 tracking-widest">Jobs Found</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 gap-4">
          <Loader2 className="animate-spin text-[#1e3a8a]" size={48} strokeWidth={3} />
          <p className="text-slate-400 font-black text-[10px]  tracking-widest">Loading Records...</p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-5xl">
          {savedJobs.length > 0 ? (
            savedJobs.map((job: any) => (
              <div 
                key={job._id} 
                className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-50 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-all"></div>
                
                <div className="flex items-center gap-8 w-full">
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-[#1e3a8a] shrink-0 group-hover:scale-110 transition-transform">
                      <Briefcase size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-black text-[#1e3a8a] tracking-tight">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-5 mt-3 text-slate-400 font-black text-[10px]  tracking-[0.1em]">
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-400"/> {job.location}</span>
                            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                            <span className="text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{job.salary || "Negotiable"}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mt-8 md:mt-0 w-full md:w-auto">
                    <Link 
                      href={`/jobs/${job._id}`} 
                      className="flex-1 md:flex-none px-8 py-4 bg-[#1e3a8a] text-white rounded-[1.2rem] font-black text-[11px]  tracking-widest shadow-xl shadow-blue-100 hover:bg-[#152963] transition-all flex items-center justify-center gap-2"
                    >
                      View Details <ExternalLink size={14} />
                    </Link>
                    <button 
                      onClick={() => handleRemove(job._id)}
                      className="p-4 bg-red-50 text-red-500 rounded-[1.2rem] hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Remove from saved"
                    >
                      <Trash2 size={20} />
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-100">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Bookmark className="text-slate-200" size={40} />
                </div>
                <h3 className="text-[#1e3a8a] font-black text-xl mb-2  tracking-tight">Your List is Empty</h3>
                <p className="font-bold text-slate-400 text-sm mb-8">You haven't saved any job opportunities yet.</p>
                <Link href="/jobs" className="bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-black text-[11px]  tracking-widest shadow-lg shadow-blue-50">
                   Discover Jobs
                </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}