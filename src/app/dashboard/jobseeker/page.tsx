"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, Bookmark, Settings, 
  CheckCircle2, FileText, ChevronRight,
  Search, Loader2, LayoutDashboard, LogOut, Bell, Sparkles,
  PartyPopper, Phone, Mail, Building2
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

  const jobOffers = data?.recentApplications?.filter((app: any) => app.status === "Offered") || [];

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
            <Link key={item.name} href={item.path} className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all whitespace-nowrap text-[13px] uppercase tracking-tight ${pathname === item.path ? 'bg-[#1e3a8a] text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50 hover:text-[#1e3a8a]'}`}>
              <item.icon size={18} strokeWidth={2.5} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden md:flex flex-col gap-6">
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
        </div>
        <AnimatePresence>
          {jobOffers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 space-y-4">
              <h2 className="text-xl font-black text-green-600 flex items-center gap-2 uppercase tracking-tighter">
                <PartyPopper className="animate-bounce" /> Congratulations! You have Job Offers
              </h2>
              
              {jobOffers.map((offer: any) => (
                <div key={offer._id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 md:p-8 rounded-[2.5rem] shadow-lg shadow-green-100 relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3">
                      <div className="bg-green-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest w-max">New Job Offer</div>
                      <h3 className="text-2xl font-black text-[#1e3a8a]">{offer.job?.title || "Job Position"}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Building2 size={18} className="text-green-600" />
                          <span className="font-bold text-sm">Employer: {offer.employer?.name || offer.job?.companyName || "Company"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone size={18} className="text-green-600" />
                          <span className="font-bold text-sm">Call: {offer.employer?.phone || "Contact via Email"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail size={18} className="text-green-600" />
                          <span className="font-bold text-sm">{offer.employer?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <a href={`mailto:${offer.employer?.email}`} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl transition-all text-center text-xs uppercase tracking-widest">
                        Accept & Contact
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-12">
            {stats.map((stat, i) => (
                <motion.div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 group">
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8`}>
                        <stat.icon size={26} strokeWidth={2.5} />
                    </div>
                    <div className="text-4xl font-black text-[#1e3a8a] mb-2">{stat.val}</div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</div>
                </motion.div>
            ))}
        </div>

        <section className="space-y-8">
            <h2 className="text-2xl font-black text-[#1e3a8a] uppercase tracking-tighter px-4">Recent History</h2>
            <div className="grid gap-5">
                {data?.recentApplications?.map((app: any) => (
                    <div key={app._id} className={`bg-white p-6 md:p-8 rounded-[2.5rem] border ${app.status === 'Offered' ? 'border-green-400 bg-green-50/30' : 'border-slate-50'} shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6`}>
                        <div className="flex items-center gap-6 w-full">
                            <div className={`w-14 h-14 ${app.status === 'Offered' ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-[#1e3a8a]'} rounded-2xl flex items-center justify-center shrink-0`}>
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-[#1e3a8a] text-lg leading-tight">{app.job?.title || app.category}</h4>
                                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">{app.city} • Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-6 py-2.5 rounded-full tracking-[0.1em] ${app.status === 'Offered' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {app.status}
                        </span>
                    </div>
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}