"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Briefcase, Bookmark, Settings, 
  CheckCircle2, FileText, ChevronRight,
  Search, Loader2, LayoutDashboard, LogOut, Bell, Sparkles
} from "lucide-react";
import Link from "next/link";
import { dashboardAPI } from "../../../services/apiService";

export default function JobSeekerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardAPI.getJobseekerStats();
        setData(res.data);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
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
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={45} />
        <p className="text-[#1e3a8a] font-bold text-sm animate-pulse">Syncing your portal...</p>
      </div>
    </div>
  );

  const navItems = [
    { name: 'Overview', path: '/dashboard/jobseeker', icon: LayoutDashboard },
    { name: 'My Applications', path: '/dashboard/jobseeker/my-applications', icon: Briefcase },
    { name: 'Saved Opportunities', path: '/dashboard/jobseeker/saved-jobs', icon: Bookmark },
    { name: 'Profile Editor', path: '/dashboard/jobseeker/profile', icon: User },
    { name: 'Account Settings', path: '/dashboard/jobseeker/settings', icon: Settings },
  ];

  const stats = [
    { label: "Total Applied", val: data?.totalApplications || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Saved Jobs", val: data?.savedJobs || 0, icon: Bookmark, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-white border-r border-slate-100 p-6 md:p-10 flex flex-col gap-10 md:min-h-screen z-20">
        <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 bg-[#1e3a8a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <span className="font-black text-lg">{data?.user?.name?.substring(0,1) || "C"}</span>
            </div>
            <div>
                <div className="font-black text-[#1e3a8a] leading-none text-base">{data?.user?.name || "Candidate"}</div>
                <div className="flex items-center gap-1 mt-1.5">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active Talent</span>
                </div>
            </div>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all whitespace-nowrap text-[13px] uppercase tracking-tight ${
                pathname === item.path 
                ? 'bg-[#1e3a8a] text-white shadow-xl shadow-blue-100' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-[#1e3a8a]'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden md:flex flex-col gap-6">
            <div className="bg-[#1e3a8a]/5 p-6 rounded-[2rem] border border-blue-50 relative overflow-hidden group">
                <Sparkles className="absolute -right-2 -top-2 text-[#1e3a8a]/10 group-hover:scale-150 transition-transform" size={60} />
                <p className="text-[10px] font-black text-[#1e3a8a] mb-3 uppercase tracking-widest relative z-10">Profile Analytics</p>
                <div className="w-full h-2 bg-white rounded-full mb-3 relative z-10">
                    <div className="w-[75%] h-full bg-[#1e3a8a] rounded-full"></div>
                </div>
                <p className="text-[9px] font-bold text-slate-500 relative z-10 uppercase">75% Complete • Good Standing</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-red-500 hover:bg-red-50 transition-all text-sm uppercase tracking-widest">
                <LogOut size={18} strokeWidth={3} /> Sign Out
            </button>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-16 overflow-y-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tighter uppercase italic">
              Talent <span className="text-blue-400">Hub</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">Hello, {data?.user?.name?.split(' ')[0]}! Ready for your next career move?</p>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Link href="/jobs" className="flex-1 lg:flex-none bg-[#1e3a8a] hover:bg-[#152963] text-white px-8 md:px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 transition-all active:scale-95 text-xs uppercase tracking-[0.1em]">
                <Search size={18} strokeWidth={3} /> Browse Jobs
            </Link>
            <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#1e3a8a] transition-all relative group shadow-sm">
                <Bell size={22} />
                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-12">
            {stats.map((stat, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                >
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={26} strokeWidth={2.5} />
                    </div>
                    <div className="text-4xl font-black text-[#1e3a8a] mb-2">{stat.val}</div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</div>
                </motion.div>
            ))}
        </div>
        <section className="space-y-8">
            <div className="flex justify-between items-center px-4">
                <h2 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tighter">Recent History</h2>
                <Link href="/dashboard/jobseeker/my-applications" className="text-blue-500 font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-full transition-all border border-transparent hover:border-blue-100">
                  Manage All
                </Link>
            </div>

            <div className="grid gap-5">
                {data?.recentApplications?.length > 0 ? (
                    data.recentApplications.map((app: any) => (
                        <div 
                            key={app._id} 
                            className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-blue-200 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-6 w-full">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] shrink-0">
                                    <Briefcase size={24} />
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-black text-[#1e3a8a] text-lg leading-tight truncate">
                                        {app.job?.title || app.category}
                                    </h4>
                                    <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                                        {app.city} • Applied on {new Date(app.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                <span className={`text-[10px] font-black uppercase px-6 py-2.5 rounded-full tracking-[0.1em] ${
                                    app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {app.status}
                                </span>
                                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                                   <ChevronRight size={20} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <FileText size={32} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-base">No active applications found.</p>
                        <Link href="/jobs" className="text-[#1e3a8a] text-xs font-black underline mt-4 block uppercase tracking-[0.2em]">Start Exploring</Link>
                    </div>
                )}
            </div>
        </section>
        <div className="mt-12 md:hidden pb-12">
            <button onClick={handleLogout} className="w-full bg-red-50 text-red-500 py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3">
                <LogOut size={18} strokeWidth={3} /> Terminate Session
            </button>
        </div>
      </main>
    </div>
  );
}