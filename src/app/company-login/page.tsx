"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
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

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", userStr);

        const userData = JSON.parse(decodeURIComponent(userStr));

        toast.success(`Welcome back ${userData.name || "User"}`);

        setTimeout(() => {
          const pendingApplicantId = localStorage.getItem("pendingApplicantId");
          const pendingPostJob = localStorage.getItem("pendingPostJob");

          if (pendingApplicantId) {
            localStorage.removeItem("pendingApplicantId");
            router.push(`/applicants/${pendingApplicantId}`);
          } else if (pendingPostJob) {
            localStorage.removeItem("pendingPostJob");
            router.push("/post-job");
          } else {
            router.push("/dashboard/employer");
          }
        }, 1000);
      } catch (err) {
        toast.error("Google login error");
      }
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please agree to the Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.login({
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");

      setTimeout(() => {
        const pendingApplicantId = localStorage.getItem("pendingApplicantId");
        const pendingPostJob = localStorage.getItem("pendingPostJob");

        if (pendingApplicantId) {
          localStorage.removeItem("pendingApplicantId");
          router.push(`/applicants/${pendingApplicantId}`);
        } else if (pendingPostJob) {
          localStorage.removeItem("pendingPostJob");
          router.push("/post-job");
        } else {
          router.push("/dashboard/employer");
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#e6e8e8] relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#e2f2f5] rounded-full blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#f0fdf4] rounded-full blur-[100px] opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.06)] border border-gray-50 p-8 relative z-10"
      >
        <Link
          href="/"
          className="inline-flex items-center text-[#00004d] font-bold text-xs mb-6 tracking-widest"
        >
          <ArrowLeft size={14} className="mr-2" />
          BACK TO HOME
        </Link>
        <h1 className="text-3xl font-black text-[#00004d] text-center mb-8">
          Company Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-[#00004d] ml-6">
              COMPANY EMAIL
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-5 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="company@email.com"
                className="w-full pl-12 pr-5 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#00004d]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#00004d] ml-6">
              PASSWORD
            </label>

            <div className="relative mt-2">
              <Lock className="absolute left-5 top-3.5 text-gray-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#00004d]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer px-2"
            onClick={() => setAgreed(!agreed)}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                agreed ? "bg-[#00004d] border-[#00004d] text-white" : "border-gray-300"
              }`}
            >
              {agreed && <Check size={12} />}
            </div>

            <p className="text-xs text-gray-500">
              Agree to Privacy Policy
            </p>
          </div>
          <button
            disabled={!agreed || loading}
            type="submit"
            className={`w-full py-3 rounded-full font-bold text-white transition-all ${
              agreed && !loading
                ? "bg-[#00004d] hover:opacity-90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "LOGIN TO COMPANY"}
          </button>
        </form>
        <p className="text-center mt-6 text-xs text-gray-400">
          Don’t have a company account?{" "}
          <Link href="/company-register" className="text-[#00004d] font-bold">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}