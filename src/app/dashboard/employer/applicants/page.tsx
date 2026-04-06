"use client"
import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, FileText, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/dashboard/employer-stats", {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(data.recentApplications || []);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert(`Application ${newStatus} successfully!`);
        fetchApplicants();
      }
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#000a31] transition-colors">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-[#000a31]">Job Applicants</h1>
        <p className="text-gray-400 font-bold mt-1">Review and manage candidates for your open positions.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="animate-spin text-[#000a31]" size={40}/>
          <p className="text-gray-400 font-bold animate-pulse">Loading candidates...</p>
        </div>
      ) : (
        <div className="max-w-5xl space-y-4">
          {applicants.length > 0 ? applicants.map((app: any) => (
            <div key={app._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#000a31] font-black text-xl border border-blue-100">
                        {app.applicant?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-black text-[#000a31] text-lg">{app.applicant?.name}</h4>
                        <div className="flex items-center gap-2">
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Applied for:</p>
                           <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{app.job?.title}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mr-4 ${
                      app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 
                      app.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {app.status}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        disabled={updatingId === app._id}
                        onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full font-bold text-xs hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <CheckCircle size={16}/> Shortlist
                      </button>
                      
                      <button 
                        disabled={updatingId === app._id}
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 border border-red-100 rounded-full font-bold text-xs hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <XCircle size={16}/> Reject
                      </button>

                      <button className="p-3 bg-slate-50 text-gray-400 rounded-2xl hover:text-[#000a31] hover:bg-white transition-all border border-transparent hover:border-gray-100">
                        <FileText size={18}/>
                      </button>
                    </div>
                </div>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                <Users className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold text-lg">No applicants found yet.</p>
                <p className="text-gray-300 text-sm">When candidates apply, they will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}