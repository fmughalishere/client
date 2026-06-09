"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Send, Share2, X, Briefcase } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", city: "", image: "",
    jobtype: "Full-Time", category: "", otherCategory: "", education: "", otherEducation: "",
    yearsOfExperience: "0", skills: "",
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
const currentJobDetails = {
        city: job?.city || "",
        salaryDemand: job?.salary || "",
        category: job?.category || "",
        education: job?.education || "",
        jobtype: job?.type || "Full-Time",
      };

      if (apps.length > 0) {
        const lastApp = apps[0];
        setFormData(prev => ({
          ...prev,
          fullName: lastApp.fullName || "",
          dob: lastApp.dob ? new Date(lastApp.dob).toISOString().split("T")[0] : "",
          image: lastApp.image || "",
          gender: lastApp.gender || "Male",
          whatsapp: lastApp.whatsapp || "+92",
          phone: lastApp.phone || "+92",
          email: lastApp.email || "",
          yearsOfExperience: lastApp.yearsOfExperience || "0",
          skills: Array.isArray(lastApp.skills) ? lastApp.skills.join(", ") : lastApp.skills || "",
          ...currentJobDetails,
          agreeTerms: false
        }));
        return true;
      } else {
        setFormData(prev => ({
          ...prev,
          ...currentJobDetails,
          agreeTerms: false
        }));
        return false;
      }
    } catch (e) {
      console.log("No previous profile dataset found");
      return false;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Job link copied!");
  };

  const handleApplyNowClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to apply");
      router.push("/login");
      return;
    }
    setShowSelectionModal(true);
  };

  const handleApplyAction = async () => {
    const token = localStorage.getItem("token");
    setIsApplying(true);
    setShowSelectionModal(false);

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          jobId: id,
          job: id
        })
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Applied successfully!");
        router.push("/dashboard/jobseeker/my-applications");
      }
      else if (res.status === 400 || res.status === 422) {
        await fetchPreviousData();
        setShowForm(true);
        toast.error("Agree to terms and complete your profile to apply for this job.");
      }
      else {
        toast.error(result.message || "Already applied to this job position");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    } finally {
      setIsApplying(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return toast.error("Please agree to terms");

    const token = localStorage.getItem("token");
    setIsApplying(true);

    const skillsPayload = typeof formData.skills === 'string'
      ? formData.skills.split(",").map(s => s.trim()).filter(s => s !== "")
      : [];

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          jobId: id,
          job: id,
          skills: skillsPayload
        })
      });

      if (res.ok) {
        toast.success("Application created successfully!");
        setShowForm(false);
        router.push("/dashboard/jobseeker/my-applications");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to submit application");
      }
    } catch (e) {
      toast.error("Error submitting form");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e6e8e8]">
        <Loader2 className="animate-spin text-[#5DBB63]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#e6e8e8] pb-20 font-sans text-[#00004d]">
      <Toaster position="top-center" />

      <AnimatePresence>
        {showSelectionModal && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[30px] p-8 text-center shadow-2xl relative">
              <button onClick={() => setShowSelectionModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20} /></button>
              <div className="bg-[#5DBB63]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-[#5DBB63]" size={30} />
              </div>
              <h3 className="text-xl font-black text-[#00004d] mb-2">Apply for Job</h3>
              <p className="text-gray-500 text-sm mb-6">Choose how you want to proceed with your application.</p>

              <div className="space-y-3">
                <button
                  onClick={handleApplyAction}
                  className="w-full bg-[#00004d] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                >
                  Apply with My Profile
                </button>
                <button
                  onClick={async () => {
                    setShowSelectionModal(false);
                    await fetchPreviousData();
                    setShowForm(true);
                  }}
                  className="w-full border-2 border-[#00004d] text-[#00004d] py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  Fill Application Form
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md px-8 py-6 border-b flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-black text-[#00004d]">Complete Job Application</h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest">Details will go to {job?.postedBy?.name || "Company"}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="agreeTerms" checked={formData.agreeTerms} onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })} className="rounded text-[#5DBB63]" />
                <label htmlFor="agreeTerms" className="text-xs font-bold text-slate-500">I confirm the details provided in my application are true.</label>
              </div>
              <button type="submit" disabled={isApplying} className="w-full py-5 bg-[#5DBB63] text-white rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 active:scale-98 transition-transform">
                {isApplying ? <Loader2 className="animate-spin" /> : <Send size={20} />} Submit
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden mb-12">
        <button onClick={handleShare} className="absolute top-6 right-6 w-10 h-10 bg-[#e6e8e8] text-[#5DBB63] rounded-full flex items-center justify-center transition-all active:scale-90">
          <Share2 size={20} />
        </button>
        <p className="text-[#5DBB63] text-[11px] font-black tracking-[0.3em] mb-2 ">Elevate Your Career in</p>
        <h2 className="text-3xl font-black text-[#5DBB63] leading-tight text-center">{job?.category}</h2>
      </section>

      <section className="max-w-xl mx-auto px-6 -mt-10 space-y-4 relative z-10">
        {[
          { label: "🏢 HIRING COMPANY", value: job?.postedBy?.name || job?.companyName || "Success Signatures" },
          { label: "📍 WORK LOCATION", value: job?.city },
          { label: "💰 MONTHLY SALARY", value: job?.salary || "50k" },
          { label: "🎓 EDUCATION", value: job?.education || "Not Specified" },
          { label: "💼 EXPERIENCE", value: job?.experience || "Entry Level" },
          { label: "📁 CATEGORY", value: job?.category },
          { label: "⏱️ TYPE", value: job?.type }
        ].map((item, idx) => (
          <div key={idx}>
            <h4 className="text-[10px] font-black text-[#00004d] tracking-widest ml-2 mb-1">{item.label}</h4>
            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-black/5 flex flex-col gap-1">
              <p className="text-base font-black text-[#5DBB63] leading-none">{item.value}</p>
            </div>
          </div>
        ))}

        <div className="pt-12 flex flex-col items-center">
          <button
            onClick={handleApplyNowClick}
            disabled={isApplying}
            className="w-full max-w-[280px] bg-[#5DBB63] text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:bg-gray-400 transition-all tracking-[0.2em] text-[11px]"
          >
            {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            <span>{isApplying ? "Please wait..." : "Apply Now"}</span>
          </button>
        </div>
      </section>
    </main>
  );
}