"use client"
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostJob() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    title: '', 
    company: '', 
    salary: '', 
    city: '', 
    description: '',
    type: 'Full-time'
  });

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
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#000a31]">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm">
        <h1 className="text-3xl font-black text-[#000a31] mb-2">Post a Vacancy</h1>
        <p className="text-gray-400 font-bold mb-10 text-sm">Find the best talent for your company.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-[10px] font-black text-[#000a31] mb-2 uppercase tracking-widest">Job Title</label>
                <input required value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-[#000a31] outline-none" placeholder="Software Engineer" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-[#000a31] mb-2 uppercase tracking-widest">Company Name</label>
                <input required value={formData.company} onChange={(e)=>setFormData({...formData, company: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-[#000a31] outline-none" placeholder="Tech Solutions" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-[10px] font-black text-[#000a31] mb-2 uppercase tracking-widest">City</label>
                <input required value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-[#000a31] outline-none" placeholder="Lahore" />
            </div>
            <div>
                <label className="block text-[10px] font-black text-[#000a31] mb-2 uppercase tracking-widest">Salary</label>
                <input value={formData.salary} onChange={(e)=>setFormData({...formData, salary: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-[#000a31] outline-none" placeholder="50,000 - 80,000" />
            </div>
          </div>
          <div>
              <label className="block text-[10px] font-black text-[#000a31] mb-2 uppercase tracking-widest">Description</label>
              <textarea required rows={5} value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-[#000a31] outline-none" placeholder="Job details..."></textarea>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#000a31] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-[#001a41] transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Publish Job"}
          </button>
        </form>
      </div>
    </div>
  );
}