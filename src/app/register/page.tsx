"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Briefcase, Mail, Lock, UserPlus, Check, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-12 bg-[#fcfcfc]">
      <Toaster />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[3rem] md:rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,77,0.05)] p-8 md:p-16 border border-gray-50 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#e2f2f5] rounded-full blur-3xl opacity-50"></div>

        <div className="mb-10 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#00004d] mb-3 uppercase tracking-tighter">Join EasyJobs</h1>
          <p className="text-gray-400 font-bold text-sm">Create your professional profile today</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10 relative z-10">
          <button 
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`py-4 px-2 rounded-full flex items-center justify-center gap-2 border-2 transition-all duration-300 active:scale-95
              ${role === "jobseeker" ? 'border-[#00d26a] bg-green-50/50 shadow-lg shadow-green-100' : 'border-slate-50 bg-slate-50 text-gray-300'}`}
          >
            <User size={20} className={role === "jobseeker" ? 'text-[#00d26a]' : 'text-gray-300'} />
            <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${role === "jobseeker" ? 'text-[#00004d]' : 'text-gray-400'}`}>Seeker</span>
          </button>
          
          <button 
            type="button"
            onClick={() => setRole("employer")}
            className={`py-4 px-2 rounded-full flex items-center justify-center gap-2 border-2 transition-all duration-300 active:scale-95
              ${role === "employer" ? 'border-[#00004d] bg-[#e2f2f5]/50 shadow-lg shadow-blue-100' : 'border-slate-50 bg-slate-50 text-gray-300'}`}
          >
            <Briefcase size={20} className={role === "employer" ? 'text-[#00004d]' : 'text-gray-300'} />
            <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${role === "employer" ? 'text-[#00004d]' : 'text-gray-400'}`}>Employer</span>
          </button>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="First Name" 
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] text-sm transition-all" 
            />
            <input 
              required type="text" placeholder="Last Name" 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] text-sm transition-all" 
            />
          </div>

          <input 
            required type="email" placeholder="Email Address" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] text-sm transition-all" 
          />
          
          <input 
            required type="password" placeholder="Strong Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] text-sm transition-all" 
          />
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${agreed ? 'bg-[#00d26a] border-[#00d26a] shadow-lg shadow-green-100' : 'border-gray-200 bg-white'}`}>
              {agreed && <Check size={14} className="text-[#00004d]" strokeWidth={4} />}
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-snug uppercase tracking-tight">
              I agree to the <span className="text-[#00004d] underline font-black">Terms of Service</span> & <span className="text-[#00004d] underline font-black">Privacy Policy</span>.
            </p>
          </div>
          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
              ${agreed 
                ? 'bg-[#00d26a] text-[#00004d] hover:bg-white hover:text-[#00d26a] border-2 border-transparent hover:border-[#00d26a] shadow-green-100' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            Create Free Account <UserPlus size={20} />
          </button>
        </form>

        <div className="mt-12 text-center relative z-10 border-t border-gray-50 pt-8">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">
            Already have an account? <Link href="/login" className="text-[#00d26a] font-black hover:underline ml-1">Login to Portal</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}