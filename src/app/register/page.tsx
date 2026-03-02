"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Briefcase, Mail, Lock, UserPlus, Check } from "lucide-react";
import api from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState("jobseeker");
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: role
    };

    try {
      const res = await api.post("/auth/register", userData);
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50">
      <Toaster />
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-gray-100"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-[#1e3a8a] mb-3 tracking-tight">Join EasyJobs</h1>
          <p className="text-gray-500 font-bold">Create your profile and start your journey</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <button 
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`p-5 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all duration-300 
              ${role === "jobseeker" ? 'border-[#00d26a] bg-green-50/50 shadow-lg shadow-green-50' : 'border-slate-50 bg-slate-50 text-gray-400 grayscale'}`}
          >
            <User size={28} className={role === "jobseeker" ? 'text-[#00d26a]' : 'text-gray-400'} />
            <span className={`font-black text-sm uppercase tracking-widest ${role === "jobseeker" ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Job Seeker</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setRole("employer")}
            className={`p-5 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all duration-300 
              ${role === "employer" ? 'border-[#1e3a8a] bg-blue-50/50 shadow-lg shadow-blue-50' : 'border-slate-50 bg-slate-50 text-gray-400 grayscale'}`}
          >
            <Briefcase size={28} className={role === "employer" ? 'text-[#1e3a8a]' : 'text-gray-400'} />
            <span className={`font-black text-sm uppercase tracking-widest ${role === "employer" ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Employer</span>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="First Name" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#1e3a8a] font-bold text-[#1e3a8a] transition-all" 
            />
            <input 
              required type="text" placeholder="Last Name" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#1e3a8a] font-bold text-[#1e3a8a] transition-all" 
            />
          </div>
          <input 
            required type="email" placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#1e3a8a] font-bold text-[#1e3a8a] transition-all" 
          />
          <input 
            required type="password" placeholder="Create Strong Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#1e3a8a] font-bold text-[#1e3a8a] transition-all" 
          />
          
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-slate-200 transition-all cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${agreed ? 'bg-[#00d26a] border-[#00d26a] shadow-lg shadow-green-200' : 'border-gray-200 bg-white group-hover:border-[#1e3a8a]'}`}>
              {agreed && <Check size={18} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              I certify that the information provided is true and I agree to the <span className="text-[#1e3a8a] underline hover:text-[#00d26a]">Terms of Service</span>.
            </p>
          </div>

          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 group
              ${agreed 
                ? 'bg-[#00d26a] hover:bg-green-600 text-white shadow-green-100 cursor-pointer active:scale-95' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            Create Free Account <UserPlus size={24} className={agreed ? 'animate-pulse' : ''} />
          </button>
        </form>

        <p className="mt-12 text-center text-gray-500 font-bold">
          Already have an account? <Link href="/login" className="text-[#1e3a8a] font-black hover:underline ml-1">Login to Portal</Link>
        </p>
      </motion.div>
    </div>
  );
}