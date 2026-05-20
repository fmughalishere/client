"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Send, Share2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await fetch(`https://easyjobspk.onrender.com/api/jobs/${id}`);
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJobDetail();
  }, [id]);

  const handleApplyAction = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply");
      router.push("/login");
      return;
    }
    setIsApplying(true);
    try {
        const applyRes = await fetch("https://easyjobspk.onrender.com/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ jobId: id })
          });
          if (applyRes.ok) {
            toast.success("Applied successfully!");
            router.push("/dashboard/jobseeker/my-applications");
          } else { toast.error("Already applied"); }
    } catch (e) { toast.error("Error"); }
    finally { setIsApplying(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied!");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#5DBB63]" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#e1eaed] pb-20 font-sans text-[#00004d]">
      <Toaster position="top-center" />
      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden mb-13">
        <button onClick={handleShare} className="absolute top-6 right-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-all active:scale-90">
          <Share2 size={20} />
        </button>
        
        <div className="mb-3 flex justify-center items-center gap-2">
            <p className="text-[#5DBB63] text-[11px] font-bold  tracking-[0.3em]">Elevate Your Career in</p>
        </div>

        <h2 className="text-3xl font-black text-[#5DBB63] leading-tight px-2">
          {job.category}
        </h2>
        
        <p className="mt-2 text-[#5DBB63] text-sm font-medium opacity-80">
          Unlock your potential with this {job.type} role
        </p>
      </section>
      <section className="max-w-xl mx-auto px-6 -mt-10 space-y-4 relative z-10">
                {[
          { label: "🏢 HIRING COMPANY", value: job.postedBy?.name || job.company || "Company Name" },
          { label: "📍 WORK LOCATION", value: job.city },
          { label: "💰 MONTHLY SALARY", value: job.salary || "Negotiable" },
          { label: "🎓 EDUCATION REQUIRED", value: job.education || "Not Specified" },
          { label: "💼 EXPERIENCE LEVEL", value: job.experience || "Fresh / Entry Level" },
          { label: "📁 JOB CATEGORY", value: job.category },
          { label: "⏱️ EMPLOYMENT TYPE", value: job.type }
        ].map((item, idx) => (<>
            <h4 className="text-[10px] font-black text-[#00004d] tracking-widest">{item.label}</h4>
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-lg shadow-black/5 flex flex-col gap-1">
            <p className="text-base font-black text-[#5DBB63] leading-none">{item.value}</p>
          </div>
          </>
        ))}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-black text-[#00004d]  tracking-widest mb-4 inline-block border-b-2 border-[#5DBB63] pb-1">
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(typeof job.skills === 'string' ? job.skills.split(',') : job.skills)?.map((skill: string, i: number) => (
              <span key={i} className="bg-[#00004d] text-white px-4 py-2 rounded-xl text-[10px] font-black  tracking-widest shadow-md">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-6">
          <h3 className="text-sm font-black text-[#00004d]  tracking-widest mb-4 inline-block border-b-2 border-[#5DBB63] pb-1">
            Job Description
          </h3>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[15px] text-gray-700 font-medium leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center text-center mt-8">
           <div className="text-[10px] font-black text-[#00004d]  tracking-widest mb-2">Verified Posting</div>
           <p className="text-xs text-gray-500 font-bold max-w-xs">
             Your application will be sent directly to the employer's dashboard for review.
           </p>
        </div>
        <div className="pt-12 flex flex-col items-center">
          <button
            onClick={handleApplyAction}
            disabled={isApplying}
            className="w-full max-w-[220px] bg-[#5DBB63] text-white py-4 rounded-[13px] font-black flex items-center justify-center gap-3 shadow-2xl shadow-green-200 active:scale-95 disabled:bg-gray-400 transition-all  tracking-[0.2em] text-[11px]"
          >
            {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            <span>{isApplying ? "Wait..." : "Apply Now"}</span>
          </button>
                  </div>

      </section>
    </main>
  );
}