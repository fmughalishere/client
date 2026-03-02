"use client";
import { motion } from "framer-motion";
import { 
  Plus, Users, Briefcase, BarChart3, 
  Settings, Bell, MoreVertical, Eye,
  CheckCircle, Clock
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const stats = [
    { label: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Applicants", value: "840", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { label: "Interviews", value: "45", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const recentJobs = [
    { id: 1, title: "UI/UX Designer", applicants: 120, status: "Active", date: "Feb 24, 2026" },
    { id: 2, title: "Node.js Developer", applicants: 45, status: "Closing Soon", date: "Feb 22, 2026" },
    { id: 3, title: "Marketing Head", applicants: 210, status: "Active", date: "Feb 20, 2026" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-8 flex flex-col gap-8">
        <div className="font-black text-[#1e3a8a] text-xl px-2 uppercase tracking-tighter">Employer Panel</div>
        <nav className="space-y-2">
          {['Overview', 'My Jobs', 'Applicants', 'Messages', 'Settings'].map((item) => (
            <button key={item} className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${item === 'Overview' ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:bg-slate-50 hover:text-[#1e3a8a]'}`}>
              {item}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1e3a8a]">Welcome Back, TechFlow!</h1>
            <p className="text-gray-400 font-bold">Manage your company's recruitment and talent pool.</p>
          </div>
          <button className="bg-[#00d26a] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-95">
            <Plus size={20} /> Post New Job
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100"
            >
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon size={28} />
              </div>
              <div className="text-4xl font-black text-[#1e3a8a] mb-1">{item.value}</div>
              <div className="text-gray-400 font-bold text-sm uppercase tracking-widest">{item.label}</div>
            </motion.div>
          ))}
        </div>
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-[#1e3a8a]">Your Active Vacancies</h2>
            <Link href="#" className="text-[#00d26a] font-black text-sm hover:underline">View All Jobs</Link>
          </div>

          <div className="space-y-4">
            {recentJobs.map((job) => (
              <motion.div 
                key={job.id} 
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-[#1e3a8a]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1e3a8a]">{job.title}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Posted on {job.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center">
                    <div className="font-black text-[#1e3a8a]">{job.applicants}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Applicants</div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {job.status}
                  </div>

                  <button className="p-3 bg-slate-50 rounded-xl text-gray-400 hover:text-[#1e3a8a] transition-colors">
                    <Eye size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}