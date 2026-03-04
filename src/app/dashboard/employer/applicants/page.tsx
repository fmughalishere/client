"use client"
import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, FileText, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/applications/employer-stats", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setApplicants(data.recentApplications || []);
      } catch (err) { console.log(err) }
      finally { setLoading(false) }
    };
    fetchApplicants();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <h1 className="text-4xl font-black text-[#1e3a8a] mb-12">Job Applicants</h1>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin" size={40}/></div>
      ) : (
        <div className="space-y-4">
          {applicants.length > 0 ? applicants.map((app: any) => (
            <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-black text-lg">
                        {app.applicant?.name?.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-[#1e3a8a]">{app.applicant?.name}</h4>
                        <p className="text-xs font-bold text-gray-400">Applied for: <span className="text-blue-600">{app.job?.title}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs hover:bg-green-100 transition-all">
                        <CheckCircle size={16}/> Shortlist
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">
                        <XCircle size={16}/> Reject
                    </button>
                    <button className="p-3 bg-slate-50 text-gray-400 rounded-xl hover:text-[#1e3a8a]"><FileText size={18}/></button>
                </div>
            </div>
          )) : (
            <p className="text-center text-gray-400 font-bold py-20 bg-white rounded-[3rem]">No applicants found yet.</p>
          )}
        </div>
      )}
    </div>
  );
}