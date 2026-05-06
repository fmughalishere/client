"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Briefcase, DollarSign, ChevronLeft, Share2, Send, Loader2, Building2 } from "lucide-react";
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
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    if (id) fetchJobDetail();
  }, [id]);

  const handleApplyAction = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) { toast.error("Please login first"); router.push("/login"); return; }
    if (user.role === "employer") { toast.error("Employers cannot apply"); return; }

    setIsApplying(true);
    try {
      const statsRes = await fetch("https://easyjobspk.onrender.com/api/applications/jobseeker-stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();

      if (!statsData.recentApplications || statsData.recentApplications.length === 0) {
        toast.error("Please fill the application form first");
        router.push(`/application?jobId=${id}`);
        return;
      }

      const profile = statsData.recentApplications[0];
      const payload = {
        jobId: id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        city: profile.city,
        category: profile.category,
        experience: profile.experience,
        education: profile.education,
        resume: profile.resume,
        skills: profile.skills,
        gender: profile.gender,
        image: profile.image
      };

      const applyRes = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (applyRes.ok) {
        toast.success("Applied successfully!");
        router.push("/dashboard/jobseeker/my-applications");
      } else {
        const err = await applyRes.json();
        toast.error(err.message || "Already applied");
      }
    } catch (err) { toast.error("Error applying"); }
    finally { setIsApplying(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-16">
      <Toaster />
      <div className="flex items-center justify-between px-6 py-6 bg-[#e2f2f5]">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><ChevronLeft /></button>
        <h1 className="font-black text-[#00004d]">Job Details</h1>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><Share2 size={20} /></button>
      </div>

      <section className="bg-[#e2f2f5] text-center pb-12 rounded-b-[50px]">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"><Briefcase size={40} className="text-[#00004d]" /></div>
        <h2 className="text-2xl font-black text-[#00004d]">{job.title}</h2>
        <div className="mt-4"><span className="bg-[#00004d] text-white px-4 py-2 rounded-full text-xs font-bold uppercase">{job.type}</span></div>
      </section>

      <div className="max-w-xl mx-auto px-6 mt-10">
        <button onClick={handleApplyAction} disabled={isApplying} className="w-full bg-[#00004d] text-white py-5 rounded-[2rem] font-black shadow-xl active:scale-95 disabled:opacity-50">
          {isApplying ? "Checking Profile..." : "APPLY FOR THIS JOB"}
        </button>
      </div>
    </main>
  );
}