"use client";
import { useState, useEffect } from "react";
import { Save, Loader2, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";

export default function JobSeekerSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', city: '', resume: '' });

  useEffect(() => {
    const fetchCurrentData = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/profile", {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setFormData({
            name: data.name,
            bio: data.profile?.bio || '',
            city: data.profile?.city || '',
            resume: data.profile?.resume || ''
        });
    };
    fetchCurrentData();
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/update-profile", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        if(res.ok) alert("Profile updated successfully!");
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/jobseeker" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-[#1e3a8a] mb-8">Account Settings</h1>
        
        <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 space-y-6">
          <div>
            <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Full Name</label>
            <input required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Professional Bio</label>
            <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData, bio: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="I am a MERN Stack Developer with 2 years experience..."></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">City</label>
              <input value={formData.city} onChange={(e)=>setFormData({...formData, city: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="e.g. Karachi" />
            </div>
            <div>
              <label className="block text-xs font-black text-[#1e3a8a] mb-2 uppercase tracking-widest">Resume URL (Optional)</label>
              <input value={formData.resume} onChange={(e)=>setFormData({...formData, resume: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#1e3a8a]" placeholder="Link to Drive/Dropbox" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#1e3a8a] text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Update Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
}