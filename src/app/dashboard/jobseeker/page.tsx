"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Bookmark, Settings,
  CheckCircle2, FileText, ChevronRight,
  Search, Loader2, LayoutDashboard, LogOut,
  PartyPopper, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { dashboardAPI } from "../../../services/apiService";

export default function JobSeekerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
          localStorage.removeItem("user");
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
    window.location.reload();
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard/jobseeker', icon: LayoutDashboard },
    { name: 'My Applications', path: '/dashboard/jobseeker/my-applications', icon: Briefcase },
    { name: 'Saved Jobs', path: '/dashboard/jobseeker/saved-jobs', icon: Bookmark },
    { name: 'Settings', path: '/dashboard/jobseeker/profile', icon: Settings },
  ];

  const activeNavItem = navItems.find(item => item.path === pathname) || navItems[0];

  if (loading) return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#e6e8e8]">
      <Loader2 className="animate-spin text-[#00004d]" size={40} />
    </div>
  );

  const jobOffers = data?.recentApplications?.filter((app: any) => app.status === "Offered") || [];

  return (
    <div className="bg-[#e6e8e8] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center lg:flex-col lg:items-center gap-4 text-center">
              <div className="w-14 h-14 bg-[#00004d] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                {data?.user?.name?.substring(0, 1) || "U"}
              </div>
              <div className="text-left lg:text-center">
                <h3 className="font-black text-[#00004d] text-base lg:text-lg leading-tight truncate w-40 sm:w-auto">
                  {data?.user?.name || "Job Seeker"}
                </h3>
                <p className="text-[10px] font-black text-[#5DBB63] uppercase tracking-[0.15em] mt-1">Active Talent</p>
              </div>
            </div>
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="w-full bg-[#00004d] text-white p-4 rounded-2xl font-bold flex items-center justify-between shadow-xl active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <activeNavItem.icon size={20} />
                  <span>{activeNavItem.name}</span>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${isMobileNavOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMobileNavOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={`flex items-center gap-3 px-6 py-4 font-bold text-sm border-b border-slate-50 last:border-0 ${pathname === item.path ? 'bg-slate-50 text-[#00004d]' : 'text-slate-500'
                          }`}
                      >
                        <item.icon size={18} className={pathname === item.path ? 'text-[#00004d]' : 'text-slate-300'} />
                        {item.name}
                      </Link>
                    ))}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 font-bold text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <nav className="hidden lg:flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all ${pathname === item.path
                      ? 'bg-[#00004d] text-white shadow-xl translate-x-2'
                      : 'bg-white text-slate-400 hover:text-[#00004d] hover:bg-slate-50'
                    }`}
                >
                  <item.icon size={20} /> {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm text-red-500 bg-white/50 hover:bg-red-50 transition-all mt-4 border border-transparent hover:border-red-100"
              >
                <LogOut size={20} /> Logout
              </button>
            </nav>
          </aside>
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/40 p-6 rounded-[2.5rem] border border-white/50">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#00004d]">Talent Dashboard</h1>
                <p className="text-slate-500 font-bold text-sm mt-1">Hello, {data?.user?.name?.split(' ')[0]}! 👋</p>
              </div>
              <Link href="/jobs" className="w-full sm:w-auto bg-[#5DBB63] hover:bg-[#4ea854] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-95 transition-all text-sm">
                <Search size={20} /> FIND JOBS
              </Link>
            </div>
            <AnimatePresence>
              {jobOffers.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                  <div className="bg-gradient-to-br from-[#5DBB63] to-[#4ea854] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] opacity-20 group-hover:rotate-12 transition-transform duration-500">
                      <PartyPopper size={180} />
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-2xl md:text-3xl font-black mb-2">YOU HAVE JOB OFFERS! 🎉</h2>
                      <p className="font-bold opacity-90 mb-6 text-sm max-w-md">Congratulations! Employers are interested in your profile. Review your offers now.</p>
                      <Link href="/dashboard/jobseeker/my-applications" className="bg-white text-[#5DBB63] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all inline-block">
                        View My Offers
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Applied", val: data?.totalApplications || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Saved Jobs", val: data?.savedJobs || 0, icon: Bookmark, color: "text-green-600", bg: "bg-green-50" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
                >
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon size={26} />
                  </div>
                  <div className="text-4xl font-black text-[#00004d] mb-1 tracking-tight">{stat.val}</div>
                  <div className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <section className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-xl md:text-2xl font-black text-[#00004d]">Recent Applications</h2>
                <Link href="/dashboard/jobseeker/my-applications" className="p-2 bg-slate-50 rounded-xl hover:bg-[#00004d] hover:text-white transition-all">
                  <ChevronRight size={20} />
                </Link>
              </div>

              <div className="space-y-4">
                {data?.recentApplications?.length > 0 ? (
                  data?.recentApplications?.map((app: any) => (
                    <div key={app._id} className="group flex items-center justify-between p-4 md:p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-50/50 hover:border-[#00004d]/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${app.status === 'Offered' ? 'bg-[#5DBB63] text-white' : 'bg-[#e6e8e8] text-[#00004d]'
                          }`}>
                          <Briefcase size={20} />
                        </div>
                        <div className="max-w-[150px] sm:max-w-none">
                          <h4 className="font-black text-[#00004d] text-base leading-tight truncate">{app.job?.title || "Job Application"}</h4>
                          <p className="text-xs font-bold text-slate-400 mt-1">
                            Status: <span className={app.status === 'Offered' ? 'text-[#5DBB63]' : 'text-blue-500'}>{app.status}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-[10px] font-black px-4 py-2 bg-white border border-slate-100 rounded-full text-slate-500">
                          {new Date(app.updatedAt || app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="font-bold text-slate-400">No applications found. Start applying!</p>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}