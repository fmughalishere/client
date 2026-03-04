"use client"
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', company: '', salary: '', location: '', description: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if(response.ok) {
        alert("Job Posted Successfully!");
        router.push('/dashboard/employer/my-jobs');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50">
        <h1 className="text-3xl font-black text-[#1e3a8a] mb-2">Create New Vacancy</h1>
        <p className="text-gray-400 font-bold mb-10">Fill in the details to find the best talent.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Job Title</label>
                <input required value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="e.g. Senior Node Developer" />
            </div>
            <div>
                <label className="block text-sm font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Salary Range</label>
                <input required value={formData.salary} onChange={(e)=>setFormData({...formData, salary: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="e.g. 80k - 120k" />
            </div>
          </div>
          <div>
              <label className="block text-sm font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Location</label>
              <input required value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="e.g. Lahore, Pakistan" />
          </div>
          <div>
              <label className="block text-sm font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Job Description</label>
              <textarea required rows={5} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="Detail about the role..."></textarea>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#00d26a] text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Post Job Now"}
          </button>
        </form>
      </div>
    </div>
  );
}