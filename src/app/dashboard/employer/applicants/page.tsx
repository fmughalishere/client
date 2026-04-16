"use client";
import { useEffect, useState } from "react";
import { Loader2, Mail, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchApplicants = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://easyjobspk.onrender.com/api/applications/employer/all-applicants", {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setApplicants(data);
    setLoading(false);
  };

  useEffect(() => { fetchApplicants(); }, []);
  const handleStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/status/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ status })
        });
        
        if(res.ok) {
            fetchApplicants();
        }
    } catch (error) {
        console.error("Status update failed", error);
    }
};
  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-[#1e3a8a] mb-8">Job Applicants</h1>
      
      <div className="grid gap-4">
        {applicants.length > 0 ? applicants.map((app: any) => (
        <div 
        key={app._id} 
        onClick={() => router.push(`/dashboard/employer/applicants/${app._id}`)}
        className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer hover:shadow-md transition-all">            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center font-bold text-xl">
                {app.user?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-slate-800">{app.user?.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-bold mt-1">
                  <span className="flex items-center gap-1"><Mail size={12}/> {app.user?.email}</span>
                  <span className="flex items-center gap-1"><Briefcase size={12}/> {app.job?.title}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 
                    app.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'
                }`}>
                    {app.status}
                </span>
                <button onClick={() => handleStatus(app._id, 'shortlisted')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all">
                    <CheckCircle size={20} />
                </button>
                <button onClick={() => handleStatus(app._id, 'rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <XCircle size={20} />
                </button>
            </div>
          </div>
        )) : (
            <p className="text-center text-slate-400 font-bold py-10">No applicants found yet.</p>
        )}
      </div>
    </div>
  );
}