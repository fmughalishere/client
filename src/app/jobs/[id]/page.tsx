"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Send, Share2, X, Briefcase, MapPin, DollarSign, GraduationCap, Clock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", city: "", image: "",
    jobtype: "Full-Time", category: "", otherCategory: "", education: "", otherEducation: "",
    yearsOfExperience: "0", skills: "", achievements: "",
    email: "", phone: "+92", whatsapp: "+92", salaryDemand: "", agreeTerms: false
  });

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

  const fetchPreviousData = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/my-applications", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const apps = await res.json();
      if (apps.length > 14) {
        const lastApp = apps[14];
        setFormData(prev => ({
          ...prev,
          fullName: lastApp.fullName || "",
          city: lastApp.city || "",
          category: lastApp.category || job?.category || "",
          whatsapp: lastApp.whatsapp || "+92",
          skills: lastApp.skills || "",
          education: lastApp.education || "",
          yearsOfExperience: lastApp.yearsOfExperience || "0",
          phone: lastApp.phone || "+92",
          email: lastApp.email || ""
        }));
      }
    } catch (e) {
      console.log("No previous data found");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied!");
  };

  const handleApplyAction = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply");
      router.push("/login");
      return;
    }

    setIsApplying(true);
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ jobId: id })
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Applied successfully!");
        router.push("/dashboard/jobseeker/my-applications");
      } 
      else if (res.status === 400 && (result.message?.toLowerCase().includes("validation failed") || result.message?.toLowerCase().includes("required"))) {
        await fetchPreviousData(); 
        setFormData(prev => ({ ...prev, category: job?.category || "" }));
        setShowForm(true); 
      } 
      else {
        toast.error(result.message || "Already applied");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    } finally {
      setIsApplying(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.agreeTerms) return toast.error("Please agree to terms");
    
    const token = localStorage.getItem("token");
    setIsApplying(true);

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ...formData, jobId: id })
      });

      if (res.ok) {
        toast.success("Applied successfully!");
        router.push("/dashboard/jobseeker/my-applications");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to submit");
      }
    } catch (e) {
      toast.error("Error submitting form");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#5DBB63]" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#e6e8e8] pb-20 font-sans text-[#00004d]">
      <Toaster position="top-center" />
            {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative animate-in zoom-in duration-300">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-black text-[#00004d]">Finish Your Profile</h2>
                <p className="text-[10px] text-slate-400 font-bold  tracking-widest">Required to complete application</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">Full Name</label>
                <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Full Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">City</label>
                  <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Lahore" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">WhatsApp</label>
                  <input required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">Category</label>
                <input required value={formData.category} readOnly className="w-full p-4 bg-slate-100 rounded-2xl border-none font-bold text-[#5DBB63]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">Education</label>
                  <input required value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Bachelors" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">Exp (Years)</label>
                  <input type="number" required value={formData.yearsOfExperience} onChange={e => setFormData({...formData, yearsOfExperience: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400  ml-2 tracking-widest">Skills</label>
                <textarea required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold h-24" placeholder="Skills separated by commas..." />
              </div>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                <input type="checkbox" checked={formData.agreeTerms} onChange={e => setFormData({...formData, agreeTerms: e.target.checked})} className="w-5 h-5 accent-[#5DBB63]" />
                <span className="text-[10px] font-black text-slate-500 ">Details are correct and match my CNIC</span>
              </label>

              <button type="submit" disabled={isApplying} className="w-full py-5 bg-[#5DBB63] text-white rounded-[2rem] font-black  tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                {isApplying ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                Complete & Apply
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden mb-13">
        <button onClick={handleShare} className="absolute top-6 right-6 w-10 h-10 bg-[#e6e8e8] text-[#5DBB63] rounded-full flex items-center justify-center transition-all active:scale-90">
          <Share2 size={20} />
        </button>
        <p className="text-[#5DBB63] text-[11px] font-black tracking-[0.3em] mb-2 ">Elevate Your Career in</p>
        <h2 className="text-3xl font-black text-[#5DBB63] leading-tight text-center">{job.category}</h2>
      </section>

      <section className="max-w-xl mx-auto px-6 -mt-10 space-y-4 relative z-10">
        {[
          { label: "🏢 HIRING COMPANY", value: job.postedBy?.name || job.company || "Success Signatures" },
          { label: "📍 WORK LOCATION", value: job.city },
          { label: "💰 MONTHLY SALARY", value: job.salary || "Negotiable" },
          { label: "🎓 EDUCATION", value: job.education || "Not Specified" },
          { label: "💼 EXPERIENCE", value: job.experience || "Entry Level" },
          { label: "📁 CATEGORY", value: job.category },
          { label: "⏱️ TYPE", value: job.type }
        ].map((item, idx) => (
          <div key={idx}>
            <h4 className="text-[10px] font-black text-[#00004d] tracking-widest ml-2 mb-1 ">{item.label}</h4>
            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-black/5 flex flex-col gap-1">
              <p className="text-base font-black text-[#5DBB63] leading-none">{item.value}</p>
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-black text-[#00004d] tracking-widest mb-4 inline-block border-b-2 border-[#5DBB63] pb-1 ">Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {(typeof job.skills === 'string' ? job.skills.split(',') : job.skills)?.map((skill: string, i: number) => (
              <span key={i} className="bg-[#00004d] text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest shadow-md">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <h3 className="text-sm font-black text-[#00004d] tracking-widest mb-4 inline-block border-b-2 border-[#5DBB63] pb-1 ">Description</h3>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[15px] text-gray-700 font-medium leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        <div className="pt-12 flex flex-col items-center">
          <button
            onClick={handleApplyAction}
            disabled={isApplying}
            className="w-full max-w-[280px] bg-[#5DBB63] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-green-200 active:scale-95 disabled:bg-gray-400 transition-all tracking-[0.2em] text-[11px] "
          >
            {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            <span>{isApplying ? "Please wait..." : "Apply Now"}</span>
          </button>
        </div>
      </section>
    </main>
  );
}