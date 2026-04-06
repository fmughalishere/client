"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, Users, Briefcase, BarChart3, 
  Settings, Loader2, LayoutDashboard
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
        // Updated Endpoint to match your Backend Route
        const response = await fetch("http://localhost:5000/api/dashboard/employer-stats", {
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
      <Loader2 className="animate-spin text-[#000a31]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-8">
        <div className="mb-4">
          <Link href="/" className="text-[#00d26a] font-black uppercase text-xs hover:underline">← Home</Link>
        </div>
        <div className="font-black text-[#000a31] text-xl px-2 uppercase tracking-tighter">Employer Panel</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${pathname === item.path ? 'bg-[#000a31] text-white shadow-lg' : 'text-gray-400 hover:bg-slate-50'}`}>
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#000a31]">Welcome Back!</h1>
            <p className="text-gray-400 font-bold">Manage your company's recruitment portal.</p>
          </div>
          <Link href="/dashboard/employer/post-job">
            <button className="bg-[#00d26a] text-white px-8 py-4 rounded-full font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all">
                <Plus size={20} /> Post New Job
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {[
             { label: "Active Jobs", val: dashboardData?.activeJobs || 0, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
             { label: "Total Applicants", val: dashboardData?.totalApplicants || 0, icon: Users, color: "text-green-600", bg: "bg-green-50" },
             { label: "Total Jobs Posted", val: dashboardData?.totalJobsPosted || 0, icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" }
           ].map((item, i) => (
             <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-6`}><item.icon size={24} /></div>
                <div className="text-4xl font-black text-[#000a31] mb-1">{item.val}</div>
                <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{item.label}</div>
             </motion.div>
           ))}
        </div>
      </main>
    </div>
  );
}