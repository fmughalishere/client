"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, Bookmark, Settings, 
  CheckCircle2, FileText, ChevronRight,
  Search, Loader2, LayoutDashboard, LogOut, Bell,
  PartyPopper
} from "lucide-react";
import Link from "next/link";
import { dashboardAPI } from "../../../services/apiService";

export default function JobSeekerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardAPI.getJobseekerStats();
        setData(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
    </div>
  );

  const jobOffers = data?.recentApplications?.filter((app: any) => app.status === "Offered") || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      {/* Sidebar - Same as before */}
      <aside className="w-full md:w-72 bg-white border-r p-8 flex flex-col gap-8 md:min-h-screen">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black">{data?.user?.name?.substring(0,2)}</div>
              <div><div className="font-black text-[#1e3a8a]">{data?.user?.name}</div><div className="text-[10px] font-bold text-[#00d26a]">Active Talent</div></div>
          </div>
          <nav className="flex md:flex-col gap-2">
            {[
                { name: 'Overview', path: '/dashboard/jobseeker', icon: LayoutDashboard },
                { name: 'My Applications', path: '/dashboard/jobseeker/my-applications', icon: Briefcase },
                { name: 'Saved Jobs', path: '/dashboard/jobseeker/saved-jobs', icon: Bookmark },
                { name: 'Settings', path: '/dashboard/jobseeker/settings', icon: Settings },
            ].map(item => (
                <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm ${pathname === item.path ? 'bg-[#1e3a8a] text-white' : 'text-gray-400'}`}>
                    <item.icon size={18} /> {item.name}
                </Link>
            ))}
          </nav>
      </aside>

      <main className="flex-1 p-5 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
            <div><h1 className="text-3xl font-black text-[#1e3a8a]">Talent Dashboard</h1><p className="text-gray-400 font-bold">Hello, {data?.user?.name?.split(' ')[0]}! 👋</p></div>
            <Link href="/jobs" className="bg-[#00d26a] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 text-sm"><Search size={18} /> Find Jobs</Link>
        </div>

        <AnimatePresence>
          {jobOffers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
               <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10"><PartyPopper size={200} /></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-2 tracking-tighter">YOU HAVE JOB OFFERS! 🎉</h2>
                    <p className="font-bold opacity-90 mb-8 text-sm">Check details and contact recruiters now.</p>
                    <Link href="/dashboard/jobseeker/my-applications" className="bg-white text-green-600 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest">View Offers</Link>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {[
                { label: "Applied", val: data?.totalApplications || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Saved", val: data?.savedJobs || 0, icon: Bookmark, color: "text-green-600", bg: "bg-green-50" },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}><stat.icon size={22} /></div>
                    <div className="text-4xl font-black text-[#1e3a8a] mb-1">{stat.val}</div>
                    <div className="text-xs font-black text-gray-400 uppercase">{stat.label}</div>
                </div>
            ))}
        </div>

        <section className="space-y-6">
            <h2 className="text-xl font-black text-[#1e3a8a]">Recent Applications</h2>
            <div className="grid gap-4">
                {data?.recentApplications?.map((app: any) => (
                    <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${app.status === 'Offered' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-[#1e3a8a]'}`}><Briefcase size={20} /></div>
                            <div>
                                <h4 className="font-black text-[#1e3a8a] text-base leading-tight">{app.job?.title || "Job Application"}</h4>
                                <p className="text-xs font-bold text-gray-400 mt-1">Status Updated: {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full tracking-wider ${app.status === 'Offered' ? 'bg-green-600 text-white shadow-md' : 'bg-blue-50 text-blue-600'}`}>
                                {app.status?.toUpperCase()}
                            </span>
                            <ChevronRight className="text-gray-300" size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}