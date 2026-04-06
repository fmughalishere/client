"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Check, ArrowLeft } from "lucide-react";
import api from "../../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      toast.success("Login Successful!");
      
      if (res.data.user.role === "employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/jobseeker");
      }
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#fcfcfc]">
      <Toaster />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.05)] border border-gray-50 overflow-hidden p-8 md:p-12 relative"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e2f2f5] rounded-full blur-3xl opacity-50"></div>

        <div className="mb-10 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] tracking-widest hover:underline"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Home
          </Link>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-black text-[#00004d] mb-2 uppercase tracking-tighter">Welcome Back</h1>
          <p className="text-gray-400 font-bold text-sm">Log in to your professional portal</p>
        </div>

        <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                    <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest">Email Address</label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
              <input 
                required type="email" placeholder="name@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-6">
              <label className="text-[10px] font-black text-[#00004d] uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[9px] font-black text-[#00d26a] hover:underline uppercase tracking-widest">Forgot?</Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
              <input 
                required type="password" placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${agreed ? 'bg-[#00d26a] border-[#00d26a] shadow-lg shadow-green-100' : 'border-gray-200 bg-white group-hover:border-[#00004d]'}`}>
              {agreed && <Check size={14} className="text-[#00004d]" strokeWidth={4} />}
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-snug uppercase tracking-tight">
              I agree to the <span className="text-[#00004d] underline font-black">Terms</span> & <span className="text-[#00004d] underline font-black">Privacy</span>
            </p>
          </div>
          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
              ${agreed 
                ? 'bg-[#00004d] text-white hover:bg-black shadow-blue-900/10' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            Login to Account <ArrowRight size={18} className={`${agreed ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </button>
        </form>

        <div className="mt-12 text-center relative z-10 border-t border-gray-50 pt-8">
          <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">
            New here? <Link href="/register" className="text-[#00d26a] font-black hover:underline ml-1">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}