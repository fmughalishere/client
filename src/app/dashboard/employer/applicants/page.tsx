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
    } catch (err) {
      console.log("Error fetching your applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplicants(); }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#1e3a8a]" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-[#f8fafc]">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1e3a8a]">Company Applicants</h1>
        <p className="text-gray-400 font-bold text-sm mt-1">Candidates who applied to your job posts</p>
      </div>
      
      <div className="grid gap-4">
        {applicants.length > 0 ? (
          applicants.map((app: any) => (
            <div 
              key={app._id} 
              onClick={() => router.push(`/dashboard/employer/applicants/${app._id}`)}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center font-black text-xl uppercase">
                  {app.fullName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg leading-tight">{app.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-bold mt-1">
                    <span className="flex items-center gap-1"><Briefcase size={12}/> {app.job?.title}</span>
                    <span className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">New Applicant</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-600' : 
                    app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>
                    {app.status}
                </span>
                <ChevronRight className="text-slate-300 group-hover:text-[#1e3a8a] transition-all" size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Briefcase className="text-slate-200" size={32} />
            </div>
            <p className="text-slate-400 font-bold">No candidates have applied to your jobs yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}