"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  User, Briefcase, Mail, Lock, UserPlus, Check, 
  ArrowLeft, Eye, EyeOff, ShieldCheck 
} from "lucide-react";
import { authAPI } from "../../services/apiService";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("jobseeker");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      role: role
    };

    try {
      await authAPI.register(userData);
      toast.success("Account created successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f8fafc] overflow-hidden relative">
      <Toaster position="top-center" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#e2f2f5] rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#f0fdf4] rounded-full blur-[100px] opacity-60"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] p-6 md:p-12 border border-white relative"
      >
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-400 font-bold  text-[10px] tracking-widest hover:text-[#00004d] transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Home
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#00004d] mb-3 tracking-tighter">
          Create Your Account
          </h1>
          <p className="text-gray-400 font-bold text-sm  tracking-wide">Start your journey with us</p>
        </div>
        <div className="flex p-1.5 bg-gray-100 rounded-full mb-10 gap-1">
          <button 
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`flex-1 py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300 font-black  text-[10px] tracking-widest
              ${role === "jobseeker" ? 'bg-white text-[#00004d] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <User size={18} /> Jobseeker
          </button>
          <button 
            type="button"
            onClick={() => setRole("employer")}
            className={`flex-1 py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300 font-black  text-[10px] tracking-widest
              ${role === "employer" ? 'bg-white text-[#00004d] shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Briefcase size={18} /> Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required type="text" placeholder="First Name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" 
              />
            </div>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required type="text" placeholder="Last Name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" 
              />
            </div>
          </div>
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              required type="email" placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              required type={showPass ? "text" : "password"} 
              placeholder="Create Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-14 pr-14 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" 
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00004d]"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              required type={showConfirmPass ? "text" : "password"} 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full pl-14 pr-14 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all" 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00004d]"
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div 
            className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-200 transition-all cursor-pointer" 
            onClick={() => setAgreed(!agreed)}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-[#00004d] border-[#00004d]' : 'border-gray-200 bg-white'}`}>
              {agreed && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-[11px] font-bold text-gray-500 leading-snug ">
              I accept the <span className="text-[#00004d] underline font-black">terms</span> & <span className="text-[#00004d] underline font-black">privacy policy</span>
            </p>
          </div>
          <button 
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-5 rounded-2xl font-black text-[12px]  tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]
              ${agreed && !loading
                ? 'bg-[#00004d] text-white hover:shadow-green-200 shadow-lg' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            {loading ? "Creating Account..." : "Create Account"} 
            {!loading && <UserPlus size={20} />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 font-bold text-[10px]  tracking-widest">
            Already have an account? 
            <Link href="/login" className="text-[#00004d] font-black hover:underline ml-2">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}