"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Bookmark, 
  Settings, 
  Bell, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  FileText,
  ChevronRight,
  TrendingUp,
  Search
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function JobSeekerDashboard() {
  const appliedJobs = [
    { id: 1, title: "Senior UI/UX Designer", company: "TechFlow Labs", status: "Interviewing", date: "Applied 2 days ago", color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, title: "Frontend Developer", company: "CyberNexus", status: "Pending", date: "Applied 5 days ago", color: "text-orange-600", bg: "bg-orange-50" },
    { id: 3, title: "Product Manager", company: "GrowFast PK", status: "Rejected", date: "Applied 1 week ago", color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row">
            <aside className="w-full md:w-72 bg-white border-r border-slate-100 p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black">
                JK
            </div>
            <div>
                <div className="font-black text-[#1e3a8a] leading-none">Junaid Khan</div>
                <div className="text-[10px] font-bold text-[#00d26a] uppercase mt-1">Pro Member</div>
            </div>
        </div>

        <nav className="space-y-2">
          {[
            { name: 'Dashboard', icon: TrendingUp, active: true },
            { name: 'My Applications', icon: Briefcase, active: false },
            { name: 'Saved Jobs', icon: Bookmark, active: false },
            { name: 'My Profile', icon: User, active: false },
            { name: 'Settings', icon: Settings, active: false },
          ].map((item) => (
            <button key={item.name} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-[#1e3a8a] text-white shadow-xl shadow-blue-100' : 'text-gray-400 hover:bg-slate-50 hover:text-[#1e3a8a]'}`}>
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-green-50 p-6 rounded-3xl border border-green-100">
            <p className="text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Profile Strength</p>
            <div className="w-full h-2 bg-white rounded-full mb-3">
                <div className="w-[85%] h-full bg-[#00d26a] rounded-full"></div>
            </div>
            <p className="text-[10px] font-bold text-green-700">85% Complete. Add your certification to reach 100%!</p>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1e3a8a]">Candidate Dashboard</h1>
            <p className="text-gray-400 font-bold">Good morning, Junaid! Here's what's happening with your applications.</p>
          </div>
          <Link href="/jobs" className="bg-[#00d26a] hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 transition-all active:scale-95">
            <Search size={20} /> Find New Jobs
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
                { label: "Total Applications", val: "24", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Shortlisted", val: "06", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
                { label: "Saved Jobs", val: "15", icon: Bookmark, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat, i) => (
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
                    <button className="text-[#00d26a] font-black text-xs uppercase hover:underline">View All</button>
                </div>

                {appliedJobs.map((job) => (
                    <motion.div 
                        key={job.id} 
                        whileHover={{ scale: 1.01 }}
                        className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                                <Briefcase className="text-[#1e3a8a]" size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-[#1e3a8a] leading-tight">{job.title}</h4>
                                <p className="text-xs font-bold text-gray-400">{job.company}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${job.bg} ${job.color}`}>
                                    {job.status}
                                </div>
                                <div className="text-[10px] font-bold text-gray-300 mt-1">{job.date}</div>
                            </div>
                            <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <ChevronRight size={20} className="text-gray-300" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </section>
            <section className="space-y-6">
                <h2 className="text-2xl font-black text-[#1e3a8a] mb-2">Notifications</h2>
                <div className="bg-white rounded-[2.5rem] border border-gray-50 p-6 space-y-6 shadow-sm">
                    {[
                        { text: "Your application for 'Senior UI Designer' was viewed.", time: "1h ago" },
                        { text: "New job alert: 'MERN Stack Developer' in Lahore.", time: "4h ago" },
                        { text: "Verify your email to get premium features.", time: "1d ago" },
                    ].map((note, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="w-2 h-2 rounded-full bg-[#00d26a] mt-1.5 shrink-0 group-hover:scale-150 transition-transform"></div>
                            <div>
                                <p className="text-sm font-bold text-[#1e3a8a] leading-snug">{note.text}</p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{note.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

      </main>
    </div>
  );
}