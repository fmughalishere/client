"use client"
import { useEffect, useState } from "react";
import { Briefcase, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://easyjobspk.onrender.com/api/applications/my-applications", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setApps(data);
      } catch (err) { console.log(err) }
      finally { setLoading(false) }
    };
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/jobseeker" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <h1 className="text-4xl font-black text-[#1e3a8a] mb-12">Track Your Applications</h1>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin" size={40}/></div>
      ) : (
        <div className="grid gap-6 max-w-4xl">
          {apps.length > 0 ? apps.map((app: any) => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e3a8a]"><Briefcase size={24} /></div>
                    <div>
                        <h4 className="text-xl font-black text-[#1e3a8a]">{app.job?.title}</h4>
                        <p className="text-gray-400 font-bold">{app.job?.company || "TechFlow Labs"}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest ${app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {app.status}
                    </div>
                    <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
          )) : (
            <div className="bg-white p-20 rounded-[3rem] text-center font-bold text-gray-400 border border-dashed border-gray-200">
                You haven't applied to any jobs yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}