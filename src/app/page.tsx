"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, PlusCircle, Briefcase, Users, ClipboardList, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { IoIosPin } from "react-icons/io";

export const MOCK_APPLICANTS = [
  {
    _id: "69e0c087b717924a23c729fe",
    fullName: "Ali Khan",
    email: "ali@example.com",
    category: "Software Engineer",
    city: "Lahore",
    country: "Pakistan",
    gender: "Male",
    dob: "2000-05-15T00:00:00.000Z",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    jobtype: "Full-time",
    education: "Bachelors in CS",
    isFresher: false,
    status: "Pending",
    experience: [{ _id: "1", designation: "Frontend Developer", companyName: "Tech Solutions", startDate: "2022-01-01", isCurrentJob: true }]
  },
  {
    _id: "78f1d298c828035b34d830gf",
    fullName: "Sara Ahmed",
    email: "sara@example.com",
    category: "Graphic Designer",
    city: "Karachi",
    country: "Pakistan",
    gender: "Female",
    dob: "1998-11-20T00:00:00.000Z",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    jobtype: "Remote",
    education: "Masters in Arts",
    isFresher: false,
    status: "Offered",
    experience: [{ _id: "2", designation: "Senior Designer", companyName: "Creative Agency", startDate: "2020-05-10", endDate: "2023-12-01", isCurrentJob: false }]
  },
  {
    _id: "89g2e309d939146c45e941hi",
    fullName: "Zain Malik", 
    email: "zain@example.com", 
    category: "Marketing Manager", 
    city: "Islamabad", 
    country: "Pakistan", 
    gender: "Male", 
    dob: "1995-03-10T00:00:00.000Z", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", 
    jobtype: "Full-time", 
    education: "MBA", 
    isFresher: true, 
    status: "Pending", 
    experience: [] 
  }
];

export default function HomePage() {
  const [applicants, setApplicants] = useState<any[]>(MOCK_APPLICANTS); 
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState(0);

  const quickActions = [
    { label: "Apply for a Job", icon: <Briefcase size={18} />, href: "/application" },
    { label: "Post a Job", icon: <PlusCircle size={18} />, href: "/dashboard/employer/post-job" },
    { label: "Job Seekers", icon: <Users size={18} />, href: "/dashboard/jobseeker" },
    { label: "Job Offers", icon: <ClipboardList size={18} />, href: "/jobs" },
  ];

  const fetchApplicants = async () => {
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/employer/all-applicants");
      const data = await res.json();
      if(data && data.length > 0) setApplicants(data);
    } catch (error) {
      console.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io("https://easyjobspk.onrender.com/");
    socket.on("visitorCount", (count: number) => setVisitorCount(count));
    fetchApplicants();
    return () => { socket.disconnect(); };
  }, []);

  const handleActionClick = (e: React.MouseEvent, action: any) => {
    e.preventDefault();
    if (action.label === "Post a Job") {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!token) { router.push("/login"); return; }
      if (user.role === "jobseeker") { router.push("/dashboard/employer/post-job"); return; }
      router.push(action.href);
    } else {
      router.push(action.href);
    }
  };

  const handleSearch = () => {
    if(searchQuery.trim()) {
      router.push(`/jobs?search=${searchQuery}`);
    }
  };

  const getExperienceLabel = (app: any) => {
    if (app.isFresher || !app.experience || app.experience.length === 0) return "Fresher";
    return "Experienced"; 
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-8 font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-[#e2f2f5] rounded-b-[35px] pt-5 pb-10 px-6 flex flex-col items-center shadow-sm relative">          
          <div className="text-center mb-1 mt-0">
            <h1 className="text-[22px] font-black text-[#00004d] leading-none">Hire easy</h1>
            <h1 className="text-[22px] font-black text-[#00004d] leading-tight">Get hired easy</h1>
          </div>
          <div className="relative w-full max-w-[250px] mt-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#00004d]" strokeWidth={3} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search jobs..." 
              className="block w-full pl-9 pr-12 py-2 bg-white border border-[#00004d] rounded-full shadow-md text-xs text-[#00004d] font-bold outline-none" 
            />
            <button 
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#00004d] font-black text-[13px] hover:opacity-70 active:scale-90 transition-all"
            >
              Go
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-md mx-auto px-6 -mt-6 relative z-20">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          {quickActions.map((action, i) => (
            <button 
              key={i} 
              onClick={(e) => handleActionClick(e, action)}
              className="w-full max-w-[210px] transition-transform active:scale-95"
            >
              <div className="flex items-center justify-center gap-2 h-[40px] bg-[#00004d] rounded-full text-white transition-all duration-300 group">
                <span>{action.icon}</span>
                <span className="font-normal text-[13px] whitespace-nowrap">{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-[360px] mx-auto px-4 mt-4 mb-4 relative z-30">
        <div className="bg-[#e2f2f5] text-[#00004d] rounded-2xl flex flex-col items-center justify-center h-16 shadow-sm border border-[#00004d]"> 
          <span className="text-[16px] font-black tracking-[0.2em] leading-none mb-1 text-center px-4">
            I am seeking for a job
          </span>
          <div className="flex flex-col items-center -space-y-3">
            <ChevronDown size={20} strokeWidth={4} />
            <ChevronDown size={20} strokeWidth={4} className="opacity-40" />
          </div>
        </div>
      </section>

      <section className="max-w-[360px] mx-auto px-4 mt-2 mb-10">
        <div className="flex flex-col gap-3">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : applicants.length > 0 ? (
            applicants.map((app: any, idx: number) => (
              <div key={idx} className="bg-[#e2f2f5] border border-gray-100 rounded-3xl p-3 flex items-center gap-4 relative shadow-sm h-21">
                <div className="w-16 h-16 rounded-full border-2 border-[#00004d] overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  <Image src={app.image || "https://via.placeholder.com/150"} alt={app.fullName || "User"} fill className="object-cover" unoptimized />
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                  <h2 className="text-base font-black text-[#00004d] truncate">{app.fullName}</h2>
                  <p className="text-[12px] font-bold text-gray-700 truncate">{app.category}</p>
                  <span className="text-[10px] font-bold text-gray-400 mt-1">{getExperienceLabel(app)}</span>
                </div>
                <div className="absolute top-3 right-4 flex flex-col items-center">
                  <IoIosPin size={14} className="text-[#00004d]" strokeWidth={4} />
                  <span className="font-bold text-[#00004d] text-[9px]">{app.city}</span>
                </div>
                <button 
                  onClick={() => router.push(`/dashboard/employer/applicants/${app._id}`)}
                  className="absolute bottom-3 right-4 bg-[#00004d] text-white px-2 py-1 rounded-full text-[11px] font-bold shadow-sm active:scale-95 transition-transform"
                >
                  Visit profile
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 font-bold py-10">No applicants found yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}