"use client";
import { useEffect, useState } from "react";
import {
  User, Mail, MapPin, FileText, ArrowLeft, Loader2,
  Save, Camera, Globe, Phone
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "", phone: "", email: "", city: "",
    avatar: "", resume: "", website: "",
    description: "", contactPerson: "", designation: ""
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://easyjobspk.onrender.com/api/user/profile", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        city: data.profile?.city || data.city || "",
        avatar: data.avatar || data.logo || "",
        resume: data.profile?.resume || "",
        website: data.website || "",
        description: data.description || "",
        contactPerson: data.contactPerson || "",
        designation: data.designation || ""
      });
    } catch (err) { toast.error("Error loading profile"); }
    finally { setLoading(false); }
  };

  const handleFileChange = (e: any, type: 'avatar' | 'resume') => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev: any) => ({ ...prev, [type]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://easyjobspk.onrender.com/api/user/update-profile", {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Profile Updated Successfully!");
        fetchProfile();
      }
    } catch (err) { toast.error("Failed to update profile"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6e8e8]">
      <Loader2 className="animate-spin text-[#00004d]" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#e6e8e8] font-sans pb-20">
      <Toaster />
      <section className="px-0 pt-0 relative">
        <div className="bg-white rounded-b-[40px] pt-6 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="flex w-full justify-between items-center mb-6 max-w-4xl">
            <Link href="/dashboard/jobseeker" className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400">
              <ArrowLeft size={20} />
            </Link>
            <h2 className="text-[#00004d] font-black tracking-tight text-lg">MY PROFILE</h2>
            <div className="w-10 h-10 opacity-0"></div>
          </div>
          <div className="relative z-10">
            <div className="w-28 h-28 bg-[#f8fafc] border-4 border-white rounded-[2rem] shadow-xl overflow-hidden flex items-center justify-center text-[#00004d] text-4xl font-black">
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" />
              ) : (
                formData.name?.substring(0, 2).toUpperCase()
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#00004d] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-all">
              <Camera size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
            </label>
          </div>

          <h1 className="mt-4 text-2xl font-black text-[#00004d] tracking-tight">{formData.name}</h1>
          <p className="text-[#00d26a] font-bold text-[10px] tracking-widest">{profile?.role} Account</p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 -mt-8 relative z-20">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-5 border border-white">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">Full Name / Company Name</label>
                <div className="flex items-center bg-gray-50 rounded-[1.2rem] px-5 py-4 border border-gray-100">
                  <User size={18} className="text-gray-300 mr-3" />
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-transparent w-full outline-none font-bold text-[#00004d]" placeholder="Enter Name" />
                </div>
              </div>

              <div className="relative opacity-60">
                <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">Email (Registered)</label>
                <div className="flex items-center bg-gray-100 rounded-[1.2rem] px-5 py-4">
                  <Mail size={18} className="text-gray-300 mr-3" />
                  <input disabled value={formData.email} className="bg-transparent w-full outline-none font-bold text-gray-500" />
                </div>
              </div>
            </div>
            {profile?.role === 'user' && (
              <div className="pt-4 border-t border-gray-50">
                <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-3 block">Professional Resume</label>
                <div className="p-6 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-[#00004d] rounded-xl flex items-center justify-center mb-3">
                    <FileText size={24} />
                  </div>
                  <label className="bg-[#00004d] text-white px-6 py-2 rounded-lg text-[10px] font-black cursor-pointer shadow-md">
                    {formData.resume ? "FILE SELECTED" : "UPLOAD RESUME"}
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'resume')} />
                  </label>
                  <p className="mt-3 text-[9px] text-gray-400 font-bold italic ">PDF, Image, or DOC (Every Type)</p>
                </div>
              </div>
            )}
            {profile?.role === 'employer' && (
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">Company Website</label>
                  <div className="flex items-center bg-gray-50 rounded-[1.2rem] px-5 py-4 border border-gray-100">
                    <Globe size={18} className="text-gray-300 mr-3" />
                    <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="bg-transparent w-full outline-none font-bold text-[#00004d]" placeholder="https://..." />
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">Contact Person</label>
                  <div className="flex items-center bg-gray-50 rounded-[1.2rem] px-5 py-4 border border-gray-100">
                    <User size={18} className="text-gray-300 mr-3" />
                    <input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="bg-transparent w-full outline-none font-bold text-[#00004d]" />
                  </div>
                </div>
                 <div className="relative">
                <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">Mobile Number</label>
                <div className="flex items-center bg-gray-50 rounded-[1.2rem] px-5 py-4 border border-gray-100">
                  <Phone size={18} className="text-gray-300 mr-3" />
                  <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-transparent w-full outline-none font-bold text-[#00004d]" placeholder="03xx xxxxxxx" />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-gray-400  tracking-[0.2em] ml-4 mb-1 block">City</label>
                <div className="flex items-center bg-gray-50 rounded-[1.2rem] px-5 py-4 border border-gray-100">
                  <MapPin size={18} className="text-gray-300 mr-3" />
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="bg-transparent w-full outline-none font-bold text-[#00004d]" placeholder="e.g. Karachi" />
                </div>
              </div>
              </div>
            )}
          </div>
          <button
            disabled={saving}
            type="submit"
            className="w-full bg-[#00004d] text-white font-black py-5 rounded-[1.2rem] shadow-lg shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3  tracking-widest text-sm"
          >
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> UPDATE PROFILE</>}
          </button>
        </form>
      </section>
    </main>
  );
}