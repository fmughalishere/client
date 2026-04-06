"use client"
import { useEffect, useState } from "react";
import { Briefcase, Users, Trash2, Edit, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
        headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setJobs(data);
      } catch (err) { console.log(err) }
      finally { setLoading(false) }
    };
    fetchMyJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-[#1e3a8a]">Your Posted Jobs</h1>
        <Link href="/dashboard/employer/post-job" className="bg-[#1e3a8a] text-white px-6 py-3 rounded-2xl font-bold shadow-lg">Post New</Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin" size={40}/></div>
      ) : (
        <div className="grid gap-6">
          {jobs.length > 0 ? jobs.map((job: any) => (
            <div key={job._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a8a]"><Briefcase size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black text-[#1e3a8a]">{job.title}</h4>
                        <div className="flex gap-4 mt-1 text-gray-400 font-bold text-xs uppercase">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <div className="text-center">
                        <div className="font-black text-[#1e3a8a]">{job.applicantsCount || 0}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Applicants</div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-slate-50 text-gray-400 rounded-xl hover:text-blue-600 transition-colors"><Edit size={18}/></button>
                        <button className="p-3 bg-slate-50 text-gray-400 rounded-xl hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                    </div>
                </div>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-[3rem] text-center font-bold text-gray-400 border-2 border-dashed border-gray-200">
                You haven't posted any jobs yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}