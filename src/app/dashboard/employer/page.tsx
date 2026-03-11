"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, Users, Briefcase, BarChart3, 
  Settings, Eye, Loader2, LayoutDashboard
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/applications/employer-stats", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navItems = [
    { name: 'Overview', path: '/dashboard/employer', icon: LayoutDashboard },
    { name: 'My Jobs', path: '/dashboard/employer/my-jobs', icon: Briefcase },
    { name: 'Applicants', path: '/dashboard/employer/applicants', icon: Users },
    { name: 'Settings', path: '/dashboard/employer/settings', icon: Settings },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-8">
        <div className="mb-8">
        <Link 
          href="/" 
          className="inline-block text-[#00d26a] font-black uppercase text-sm hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
        <div className="font-black text-[#1e3a8a] text-xl px-2 uppercase tracking-tighter">Employer Panel</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${pathname === item.path ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-slate-50 hover:text-[#1e3a8a]'}`}>
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1e3a8a]">Welcome Back!</h1>
            <p className="text-gray-400 font-bold">Manage your company's recruitment and talent pool.</p>
          </div>
          <Link href="/dashboard/employer/post-job">
            <button className="bg-[#00d26a] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-95">
                <Plus size={20} /> Post New Job
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {[
             { label: "Active Jobs", val: dashboardData?.stats?.activeJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Total Applicants", val: dashboardData?.stats?.totalApplicants || 0, icon: Users, color: "text-green-600", bg: "bg-green-50" },
             { label: "Total Jobs Posted", val: dashboardData?.stats?.totalJobsPosted || 0, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" }
           ].map((item, i) => (
             <motion.div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100">
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}><item.icon size={28} /></div>
                <div className="text-4xl font-black text-[#1e3a8a] mb-1">{item.val}</div>
                <div className="text-gray-400 font-bold text-sm uppercase tracking-widest">{item.label}</div>
             </motion.div>
           ))}
        </div>
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-[#1e3a8a]">Recent Applications</h2>
            <Link href="/dashboard/employer/applicants" className="text-[#00d26a] font-black text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.recentApplications?.map((app: any) => (
                <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center"><Users className="text-[#1e3a8a]" size={20} /></div>
                        <div>
                            <h4 className="font-black text-[#1e3a8a]">{app.applicant?.name}</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Job: {app.job?.title}</p>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'shortlisted' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{app.status}</div>
                </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}