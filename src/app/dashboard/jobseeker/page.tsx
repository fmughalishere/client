"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Briefcase, Bookmark, Settings, 
  CheckCircle2, FileText, ChevronRight,
  TrendingUp, Search, Loader2, LayoutDashboard
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function JobSeekerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/applications/jobseeker-stats", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching jobseeker data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/jobseeker', icon: LayoutDashboard },
    { name: 'My Applications', path: '/dashboard/jobseeker/my-applications', icon: Briefcase },
    { name: 'Saved Jobs', path: '/dashboard/jobseeker/saved-jobs', icon: Bookmark },
    { name: 'My Profile', path: '/dashboard/jobseeker/profile', icon: User },
    { name: 'Settings', path: '/dashboard/jobseeker/settings', icon: Settings },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shortlisted': return { color: "text-green-600", bg: "bg-green-50" };
      case 'rejected': return { color: "text-red-600", bg: "bg-red-50" };
      case 'interviewing': return { color: "text-blue-600", bg: "bg-blue-50" };
      default: return { color: "text-orange-600", bg: "bg-orange-50" };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
    </div>
  );

  const stats = [
    { label: "Total Applications", val: data?.totalApplications || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Shortlisted", val: data?.shortlisted || 0, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Saved Jobs", val: data?.savedJobs || 0, icon: Bookmark, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black uppercase">
                {data?.user?.name?.substring(0,2) || "JK"}
            </div>
            <div>
                <div className="font-black text-[#1e3a8a] leading-none">{data?.user?.name || "Junaid Khan"}</div>
                <div className="text-[10px] font-bold text-[#00d26a] uppercase mt-1">Pro Member</div>
            </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                pathname === item.path 
                ? 'bg-[#1e3a8a] text-white shadow-xl shadow-blue-100' 
                : 'text-gray-400 hover:bg-slate-50 hover:text-[#1e3a8a]'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto bg-green-50 p-6 rounded-3xl border border-green-100">
            <p className="text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Profile Strength</p>
            <div className="w-full h-2 bg-white rounded-full mb-3">
                <div className="w-[85%] h-full bg-[#00d26a] rounded-full"></div>
            </div>
            <p className="text-[10px] font-bold text-green-700">85% Complete. Update profile to reach 100%!</p>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1e3a8a]">Candidate Dashboard</h1>
            <p className="text-gray-400 font-bold">Welcome back, {data?.user?.name?.split(' ')[0] || "Junaid"}!</p>
          </div>
          <Link href="/jobs" className="bg-[#00d26a] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-95">
            <Search size={20} /> Find New Jobs
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, i) => (
                <motion.div 
                    key={i} 
                    variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-gray-100"
                >
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                        <stat.icon size={24} />
                    </div>
                    <div className="text-4xl font-black text-[#1e3a8a] mb-1">{stat.val}</div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-black text-[#1e3a8a]">Recent Applications</h2>
                    <Link href="/dashboard/jobseeker/my-applications" className="text-[#00d26a] font-black text-xs uppercase hover:underline">View All</Link>
                </div>

                {data?.recentApplications?.length > 0 ? (
                    data.recentApplications.map((app: any) => {
                        const style = getStatusStyle(app.status);
                        return (
                            <motion.div 
                                key={app._id} 
                                whileHover={{ scale: 1.01 }}
                                className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                        <Briefcase className="text-[#1e3a8a]" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#1e3a8a] leading-tight">{app.job?.title}</h4>
                                        <p className="text-xs font-bold text-gray-400">{app.job?.company || "Company Name"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${style.bg} ${style.color}`}>
                                            {app.status}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-300 mt-1">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/jobseeker/my-applications`} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                        <ChevronRight size={20} className="text-gray-300" />
                                    </Link>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <p className="text-gray-400 font-bold text-center py-10">No applications yet. Start applying!</p>
                )}
            </section>
            
            <section className="space-y-6">
                <h2 className="text-2xl font-black text-[#1e3a8a] mb-2">Notifications</h2>
                <div className="bg-white rounded-[2.5rem] border border-gray-50 p-6 space-y-6 shadow-sm">
                    <div className="flex gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-[#00d26a] mt-1.5 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <div>
                            <p className="text-sm font-bold text-[#1e3a8a] leading-snug">Welcome to easyjobs.pk! Complete your profile to get noticed.</p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Just now</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}