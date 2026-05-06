"use client";
import { useEffect, useState } from "react";
import { Loader2, Mail, Briefcase, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchApplicants = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/employer/all-applicants", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplicants(); }, []);

  const handleStatus = async (id: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    try {
        await fetch(`https://easyjobspk.onrender.com/api/applications/status/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        fetchApplicants();
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1e3a8a]" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-[#f8fafc]">
      <h1 className="text-2xl font-black text-[#1e3a8a] mb-8">Job Applicants</h1>
      
      <div className="grid gap-4">
        {applicants.length > 0 ? applicants.map((app: any) => (
          <div 
            key={app._id} 
            onClick={() => router.push(`/dashboard/employer/applicants/${app._id}`)}
            className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
                {app.fullName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-800">{app.fullName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                  <span className="flex items-center gap-1"><Mail size={12}/> {app.email}</span>
                  <span className="flex items-center gap-1 text-[#1e3a8a]"><Briefcase size={12}/> {app.job?.title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-600' : 
                    app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>
                    {app.status}
                </span>
                <div className="flex gap-1">
                    <button onClick={(e) => handleStatus(app._id, 'shortlisted', e)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl">
                        <CheckCircle size={20} />
                    </button>
                    <button onClick={(e) => handleStatus(app._id, 'rejected', e)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
                        <XCircle size={20} />
                    </button>
                </div>
                <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">No applications found for your jobs yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}