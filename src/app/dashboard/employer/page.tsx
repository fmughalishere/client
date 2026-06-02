"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Users, Briefcase, CheckCircle2,
  Settings, Loader2, LayoutDashboard, LogOut,
  ChevronRight, ChevronDown, Menu
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch("https://easyjobspk.onrender.com/api/dashboard/employer-stats", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Dashboard Error:", err);
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
    { name: 'Overview', path: '/dashboard/employer', icon: LayoutDashboard },
    { name: 'Post a Job', path: '/post-job', icon: Plus },
    { name: 'Applicants', path: '/dashboard/employer/applicants', icon: Users },
    { name: 'Settings', path: '/dashboard/employer/profile', icon: Settings },
  ];

  const activeNavItem = navItems.find(item => item.path === pathname) || navItems[0];

  if (loading) return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#e6e8e8]">
      <Loader2 className="animate-spin text-[#00004d]" size={40} />
    </div>
  );

  const stats = [
    { label: "Active Jobs", val: data?.activeJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Applicants", val: data?.totalApplicants || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="bg-[#e6e8e8] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center lg:flex-col lg:items-center gap-4 text-center">
              <div className="w-14 h-14 bg-[#00004d] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                {data?.user?.companyName?.substring(0, 1) || "E"}
              </div>
              <div className="text-left lg:text-center">
                <h3 className="font-black text-[#00004d] text-base lg:text-lg leading-tight truncate w-40 sm:w-auto">
                  {data?.user?.companyName || "Employer"}
                </h3>
                <p className="text-[10px] font-black text-[#5DBB63] uppercase tracking-[0.15em] mt-1">Hiring Manager</p>
              </div>
            </div>

            <div className="lg:hidden relative">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="w-full bg-[#00004d] text-white p-4 rounded-2xl font-bold flex items-center justify-between shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform"
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
                      ? 'bg-[#00004d] text-white shadow-xl shadow-blue-900/20 translate-x-2'
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
                <h1 className="text-2xl md:text-4xl font-black text-[#00004d] tracking-tight">Overview</h1>
                <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
                  Welcome back to your dashboard
                </p>
              </div>
              <Link href="/post-job" className="w-full sm:w-auto bg-[#5DBB63] hover:bg-[#4ea854] text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-95 transition-all text-sm">
                <Plus size={20} strokeWidth={3} /> POST NEW JOB
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-[#00004d]/20 transition-all"
                >
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={26} />
                  </div>
                  <div className="text-4xl font-black text-[#00004d] mb-1 tracking-tight">{stat.val}</div>
                  <div className="text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <section className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-xl md:text-2xl font-black text-[#00004d]">Recent Applicants</h2>
                <Link href="/dashboard/employer/applicants" className="p-2 bg-slate-50 rounded-xl hover:bg-[#00004d] hover:text-white transition-all">
                  <ChevronRight size={20} />
                </Link>
              </div>

              <div className="space-y-4">
                {data?.recentApplicants?.length > 0 ? (
                  data?.recentApplicants?.map((app: any) => (
                    <div key={app._id} className="group flex items-center justify-between p-4 md:p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-50/50 hover:border-[#00004d]/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#e6e8e8] rounded-2xl flex items-center justify-center text-[#00004d] font-black text-lg group-hover:bg-[#00004d] group-hover:text-white transition-all shadow-sm">
                          {app.fullName?.substring(0, 1) || "A"}
                        </div>
                        <div>
                          <h4 className="font-black text-[#00004d] text-base leading-tight">{app.fullName}</h4>
                          <p className="text-xs font-bold text-slate-400 mt-1">
                            Role: <span className="text-[#5DBB63]">{app.job?.title}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-[10px] font-black px-4 py-2 bg-white border border-slate-100 rounded-full text-slate-500 shadow-sm">
                          {app.status?.toUpperCase()}
                        </span>
                        <Link href={`/dashboard/employer/applicants/${app._id}`} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 group-hover:bg-[#5DBB63] group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="font-bold text-slate-400">No recent applicants to show.</p>
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