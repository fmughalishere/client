"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Check, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
function LoginContent() {
  const [agreed, setAgreed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      toast.success("Login Successful!");

      setTimeout(() => {
        const pendingForm = localStorage.getItem("pendingJobApplication");

        if (pendingForm) {
          router.push("/application"); 
        } else {
          if (res.data.user.role === "employer") {
            router.push("/dashboard/employer");
          } else {
            router.push("/dashboard/jobseeker");
          }
        }
      }, 1000);
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#fcfcfc] relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#e2f2f5] rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#f0fdf4] rounded-full blur-[100px] opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] border border-gray-50 overflow-hidden p-8 md:p-12 relative z-10"
      >
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00004d] font-black text-[10px] tracking-widest hover:text-[#00004d] transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Home
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#00004d] mb-2 tracking-tighter">
            Welcome Back
          </h1>
          <p className="text-gray-400 font-bold text-xs tracking-widest">Access your professional portal</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#00004d] ml-6 tracking-widest">Email Address</label>
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
              <label className="text-[10px] font-black text-[#00004d] tracking-widest">Password</label>
              <Link href="#" className="text-[9px] font-black text-[#00004d] hover:underline tracking-widest">Forgot?</Link>
            </div>
            <div className="relative flex items-center group">
              <Lock className="absolute left-6 text-gray-300 group-focus-within:text-[#00004d] transition-colors" size={18} />
              <input 
                required type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-slate-50 border-2 border-transparent focus:border-[#00004d] focus:bg-white rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 text-gray-300 hover:text-[#00004d] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer group" onClick={() => setAgreed(!agreed)}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 
              ${agreed ? 'bg-[#00004d] border-[#00004d] shadow-lg shadow-green-100' : 'border-gray-200 bg-white group-hover:border-[#00004d]'}`}>
              {agreed && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-[10px] font-bold text-gray-400 leading-snug tracking-tight">
              Keep me logged in & agree to <span className="text-[#00004d] underline font-black">Privacy</span>
            </p>
          </div>
          <button 
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-5 rounded-full font-black text-xs tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95
              ${agreed && !loading
                ? 'bg-[#00004d] text-white hover:bg-[#00004d]/90 shadow-blue-900/20' 
                : 'bg-slate-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            {loading ? "Authenticating..." : "Login to Account"} 
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        <div className="mt-12 text-center border-t border-gray-50 pt-8">
          <p className="text-gray-400 font-bold text-[10px] tracking-widest">
            Don't have an account? 
            <Link href="/register" className="text-[#00004d] font-black hover:underline ml-1">Create New</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}