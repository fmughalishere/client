"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Check } from "lucide-react";
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
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 bg-slate-50">
      <Toaster />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-gray-100 overflow-hidden p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#1e3a8a] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to manage your career</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-sm font-black text-[#1e3a8a] ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-5 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" size={20} />
              <input 
                required type="email" placeholder="name@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#1e3a8a] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#1e3a8a]" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-black text-[#1e3a8a] uppercase tracking-wider">Password</label>
              <Link href="#" className="text-xs font-black text-[#00d26a] hover:underline uppercase">Forgot Password?</Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-5 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" size={20} />
              <input 
                required type="password" placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#1e3a8a] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#1e3a8a]" 
              />
            </div>
          </div>

          <div className="flex items-start gap-3 px-1 py-2 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${agreed ? 'bg-[#00d26a] border-[#00d26a] shadow-lg shadow-green-100' : 'border-gray-200 bg-white group-hover:border-[#1e3a8a]'}`}>
              {agreed && <Check size={16} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-xs font-bold text-gray-500 leading-snug">
              I agree to the <span className="text-[#1e3a8a] underline cursor-pointer hover:text-[#00d26a]">Terms of Service</span> and <span className="text-[#1e3a8a] underline cursor-pointer hover:text-[#00d26a]">Privacy Policy</span> of EasyJobs.pk
            </p>
          </div>

          <button 
            type="submit"
            disabled={!agreed}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 group 
              ${agreed 
                ? 'bg-[#1e3a8a] hover:bg-blue-900 text-white shadow-blue-100 cursor-pointer active:scale-95' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            Login to Account <ArrowRight size={20} className={`${agreed ? 'group-hover:translate-x-1' : ''} transition-transform`} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 font-bold">
            New here? <Link href="/register" className="text-[#00d26a] font-black hover:underline ml-1">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}