"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MapPin, Briefcase, DollarSign, Clock, ChevronLeft, 
  Share2, Send, ShieldCheck, CheckCircle2, Loader2, 
  Building2, AlignLeft, Layers
} from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetail();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} in ${job?.city}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc]">
        <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
        <p className="text-[#00004d] font-black tracking-widest text-sm ">Fetching Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-[#00004d]">Job Not Found</h2>
        <button onClick={() => router.push("/jobs")} className="mt-4 text-[#00004d] font-bold underline">Back to all jobs</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-16 font-sans">
      <div className="flex items-center justify-between px-6 py-6 bg-[#e2f2f5]">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#00004d] active:scale-90 transition-all border border-[#00004d]/5"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <h1 className="font-black text-[#00004d]  tracking-tighter">Job Details</h1>
        <button 
          onClick={handleShare}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#00004d] active:scale-90 transition-all border border-[#00004d]/5"
        >
          <Share2 size={20} />
        </button>
      </div>
      <section className="bg-[#e2f2f5] px-6 pb-12 rounded-b-[50px] text-center shadow-sm border-b border-[#00004d]/5">
        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-white">
          <Briefcase size={40} className="text-[#00004d]" />
        </div>
        <h2 className="text-2xl font-black text-[#00004d] leading-tight px-4">{job.title}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-70">
          <Building2 size={16} className="text-[#00004d]" />
          <span className="text-sm font-bold text-[#00004d]  tracking-wider">Hiring Company</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <span className="bg-[#00004d] text-white text-[10px] font-black px-4 py-2 rounded-full  tracking-widest shadow-md">
            {job.type}
          </span>
          <span className="bg-white text-[#00004d] text-[10px] font-black px-4 py-2 rounded-full  tracking-widest border border-[#00004d]/10 shadow-sm">
            {job.category}
          </span>
        </div>
      </section>
      <section className="max-w-xl mx-auto px-6 -mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e2f2f5] flex items-center gap-3">
          <div className="p-2 bg-[#e2f2f5] rounded-xl text-[#00004d]"><MapPin size={18} /></div>
          <div>
            <p className="text-[9px] font-black text-gray-400  tracking-widest">Location</p>
            <p className="text-xs font-black text-[#00004d]">{job.city}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-[#e2f2f5] flex items-center gap-3">
          <div className="p-2 bg-[#e2f2f5] rounded-xl text-[#00004d]"><DollarSign size={18} /></div>
          <div>
            <p className="text-[9px] font-black text-gray-400  tracking-widest">Monthly Salary</p>
            <p className="text-xs font-black text-[#00004d]">{job.salary || "Negotiable"}</p>
          </div>
        </div>
      </section>
      <section className="max-w-xl mx-auto px-6 mt-8 space-y-8">
                <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-[#00004d]" />
            <h3 className="text-sm font-black text-[#00004d]  tracking-widest">Required Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {job.skills && job.skills.map((skill: string, i: number) => (
              <span key={i} className="bg-white text-[#00004d] px-4 py-2 rounded-xl text-xs font-bold border-2 border-[#e2f2f5] shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft size={18} className="text-[#00004d]" />
            <h3 className="text-sm font-black text-[#00004d]  tracking-widest">Description</h3>
          </div>
          <div className="bg-[#e2f2f5]/30 p-6 rounded-[2.5rem] border border-[#e2f2f5] shadow-inner">
            <p className="text-sm text-gray-700 font-bold leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-[#00004d]" />
            <h3 className="text-sm font-black text-[#00004d]  tracking-widest">Our Promise</h3>
          </div>
          <ul className="space-y-3">
            {["Verified Employer", "Direct Communication", "Fast Response Guaranteed"].map((text, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <CheckCircle2 size={16} className="text-green-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-6 pb-10">
          <button 
             onClick={() => router.push(`/application?jobId=${job._id}`)}
             className="w-full bg-[#00004d] text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,0,77,0.2)] active:scale-95 hover:bg-black transition-all"
          >
            <Send size={18} strokeWidth={3} /> 
            <span>APPLY FOR THIS JOB</span>
          </button>
          <p className="text-center text-[10px] text-gray-400 font-bold mt-4  tracking-widest">
            By applying, you agree to our Terms of Service
          </p>
        </div>

      </section>
    </main>
  );
}