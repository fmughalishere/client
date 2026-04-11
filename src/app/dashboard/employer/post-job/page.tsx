"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, DollarSign, AlignLeft, Send, CheckCircle } from "lucide-react";
import SuccessModal from "../../../../components/SuccessModal";

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    salary: "",
    type: "Full-time",
    experience: "",
    description: "",
    skills: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/jobs", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
            ...formData,
            skills: formData.skills.split(",").map(s => s.trim())
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to post job");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    router.push("/dashboard/employer/my-jobs");
  };

  const inputStyle = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#1e3a8a] transition-all font-bold text-slate-700";
  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-[#1e3a8a] mb-2">Create New Vacancy</h1>
        <p className="text-slate-400 font-bold mb-10">Fill in the details to find your next great hire.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Job Title</label>
              <input required type="text" placeholder="e.g. Senior Frontend Developer" className={inputStyle}
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Category</label>
              <select required className={inputStyle} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="">Select Category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelStyle}>City</label>
              <input required type="text" placeholder="Lahore" className={inputStyle}
                onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Salary Range</label>
              <input type="text" placeholder="e.g. 80k - 100k" className={inputStyle}
                onChange={(e) => setFormData({...formData, salary: e.target.value})} />
            </div>
            <div>
              <label className={labelStyle}>Job Type</label>
              <select className={inputStyle} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelStyle}>Skills (Comma separated)</label>
            <input type="text" placeholder="React, Node.js, TypeScript" className={inputStyle}
              onChange={(e) => setFormData({...formData, skills: e.target.value})} />
          </div>

          <div>
            <label className={labelStyle}>Job Description</label>
            <textarea required rows={5} placeholder="Describe the role and responsibilities..." className={inputStyle}
              onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#1e3a8a] text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {loading ? "Publishing..." : <><Send size={20} /> Publish Job Listing</>}
          </button>
        </form>
      </div>
      {showSuccess && (
        <SuccessModal 
          isOpen={showSuccess} 
          onClose={handleModalClose}
          title="Job Published!"
          message="Your job listing has been posted successfully and is now live for candidates."
        />
      )}
    </div>
  );
}