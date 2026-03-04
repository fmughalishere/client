"use client"
import { useState } from "react";
import { Settings, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmployerSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ companyName: 'TechFlow Labs', email: 'hr@techflow.com', bio: '', location: 'Karachi' });

  const handleUpdate = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert("Profile Updated Successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/employer" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-[#1e3a8a] mb-8">Settings</h1>
        
        <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 space-y-6">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-gray-400"><Settings size={32}/></div>
             <div>
                <h3 className="font-black text-[#1e3a8a]">Company Profile</h3>
                <p className="text-xs text-gray-400 font-bold">Update your public information.</p>
             </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Company Name</label>
            <input value={formData.companyName} onChange={(e)=>setFormData({...formData, companyName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Bio / Description</label>
            <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="Tell us about your company..."></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Contact Email</label>
              <input readOnly value={formData.email} className="w-full p-4 bg-slate-100 text-gray-400 rounded-2xl border-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Headquarters</label>
              <input value={formData.location} onChange={(e)=>setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}