"use client";
import { useEffect, useState } from "react";
import { User, Mail, MapPin, FileText, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://easyjobspk.onrender.com/api/users/profile", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <Link href="/dashboard/jobseeker" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a]">
        <ArrowLeft size={20} /> Dashboard
      </Link>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-gray-50 h-fit">
            <div className="w-24 h-24 bg-[#1e3a8a] rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black ">
                {profile?.name?.substring(0,2)}
            </div>
            <h2 className="text-2xl font-black text-[#1e3a8a] text-center">{profile?.name}</h2>
            <p className="text-[#00d26a] font-bold text-center text-xs  tracking-widest mt-1">Job Seeker</p>
            
            <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                    <Mail size={16}/> {profile?.email}
                </div>
                <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                    <MapPin size={16}/> {profile?.profile?.city || "Location not set"}
                </div>
            </div>
            
            <Link href="/dashboard/jobseeker/settings" className="block w-full text-center mt-8 py-4 border-2 border-slate-100 rounded-2xl font-bold text-gray-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-all">
                Edit Profile
            </Link>
        </div>

        <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
                <h3 className="text-xl font-black text-[#1e3a8a] mb-4">About Me</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                    {profile?.profile?.bio || "No bio added yet. Add a short professional summary in settings."}
                </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
                <h3 className="text-xl font-black text-[#1e3a8a] mb-6">Resume / CV</h3>
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm"><FileText/></div>
                        <div>
                            <p className="font-bold text-[#1e3a8a]">Professional_CV.pdf</p>
                            <p className="text-[10px] font-bold text-gray-400  tracking-widest">Added on {new Date(profile?.updatedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button className="text-[#1e3a8a] font-black text-sm hover:underline">View File</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}