"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, Users, Briefcase, CheckCircle2, 
  Settings, Loader2, LayoutDashboard, LogOut, Bell,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
    </div>
  );

  const stats = [
    { label: "Active Jobs", val: data?.activeJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Applicants", val: data?.totalApplicants || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-6 md:p-8 flex flex-col gap-8 md:min-h-screen">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black text-sm">
                {data?.user?.companyName?.substring(0,2) || "CO"}
            </div>
            <div>
                <div className="font-black text-[#1e3a8a] text-sm md:text-base">
                  {data?.user?.companyName || "Employer"}
                </div>
                <div className="text-[10px] font-bold text-[#00d26a] mt-1 tracking-wider">Hiring Manager</div>
            </div>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
          {[
            { name: 'Overview', path: '/dashboard/employer', icon: LayoutDashboard },
            { name: 'Post a Job', path: '/dashboard/employer/post-job', icon: Plus },
            { name: 'Applicants', path: '/dashboard/employer/applicants', icon: Users },
            { name: 'Settings', path: '/dashboard/employer/settings', icon: Settings },
          ].map((item) => (
            <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-4 md:px-6 py-3 rounded-2xl font-bold transition-all text-sm ${pathname === item.path ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-400 hover:bg-slate-50'}`}>
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-auto hidden md:flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50">
            <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-5 md:p-12 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1e3a8a]">Employer Dashboard</h1>
            <p className="text-gray-400 font-bold text-sm">Manage your talent pool 💼</p>
          </div>
          <Link href="/dashboard/employer/post-job" className="bg-[#00d26a] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl active:scale-95 text-sm">
            <Plus size={18} /> Post New Job
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}><stat.icon size={22} /></div>
                    <div className="text-4xl font-black text-[#1e3a8a] mb-1">{stat.val}</div>
                    <div className="text-xs font-black text-gray-400 tracking-widest uppercase">{stat.label}</div>
                </motion.div>
            ))}
        </div>

        <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black text-[#1e3a8a]">Recent Applicants</h2>
            <div className="grid gap-4">
                {data?.recentApplicants?.map((app: any) => (
                    <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#1e3a8a]/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e3a8a] font-bold text-lg">
                                {app.applicant?.name?.substring(0,1)}
                            </div>
                            <div>
                                <h4 className="font-black text-[#1e3a8a] text-base leading-tight">{app.applicant?.name}</h4>
                                <p className="text-xs font-bold text-gray-400 mt-1">Applied for: <span className="text-[#1e3a8a]">{app.job?.title}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full tracking-wider ${
                                app.status === 'Offered' ? 'bg-blue-600 text-white' : 
                                app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                {app.status?.toUpperCase()}
                            </span>
                            <Link href={`/dashboard/employer/applicants/${app._id}`}>
                                <ChevronRight className="text-gray-300 group-hover:text-[#1e3a8a]" size={20} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}