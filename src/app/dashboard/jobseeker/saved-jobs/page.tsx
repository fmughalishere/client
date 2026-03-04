"use client";
import { useEffect, useState } from "react";
import { Bookmark, Briefcase, MapPin, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/saved-jobs", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSavedJobs(data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSavedJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/jobseeker" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <h1 className="text-4xl font-black text-[#1e3a8a] mb-12">Saved Opportunities</h1>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1e3a8a]" size={40}/></div>
      ) : (
        <div className="grid gap-6 max-w-4xl">
          {savedJobs.length > 0 ? savedJobs.map((job: any) => (
            <div key={job._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600"><Briefcase size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black text-[#1e3a8a]">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-gray-400 font-bold text-xs uppercase tracking-widest">
                            <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                            <span>•</span>
                            <span className="text-[#00d26a]">{job.salary || "Negotiable"}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <Link href={`/jobs/${job._id}`} className="px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">Apply Now</Link>
                    <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={20}/></button>
                </div>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                <Bookmark className="mx-auto text-gray-200 mb-4" size={60} />
                <p className="font-bold text-gray-400">No jobs saved yet. Start exploring!</p>
                <Link href="/jobs" className="text-[#1e3a8a] underline mt-2 inline-block font-bold">Browse Jobs</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}