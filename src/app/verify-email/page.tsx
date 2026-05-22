"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (token) {
      fetch(`https://easyjobspk.onrender.com/api/auth/verify-email?token=${token}`)
        .then((res) => {
          if (res.ok) {
            setStatus("success");
            toast.success("Email Verified Successfully!");
            setTimeout(() => router.push("/login"), 3000);
          } else {
            setStatus("error");
            toast.error("Invalid or expired token.");
          }
        })
        .catch(() => {
            setStatus("error");
            toast.error("Network error occurred.");
        });
    } else {
        setStatus("error");
    }
  }, [token, router]);

  return (
    <div className="text-center p-8 md:p-12 bg-[#f7fafa] rounded-[2.5rem] shadow-2xl max-w-md w-full border border-gray-100">
      {status === "verifying" && (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-[#00004d] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-black text-[#00004d] uppercase tracking-tight">Verifying Email...</h2>
          <p className="text-gray-400 text-sm font-bold">Please wait while we confirm your account.</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">✓</div>
          <h2 className="text-2xl font-black text-[#00004d] uppercase tracking-tight">Account Verified!</h2>
          <p className="text-gray-500 font-bold text-sm">Humne aapka account verify kar liya hai. Ab aap login kar sakte hain.</p>
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-4">Redirecting you to login...</div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">⚠</div>
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-tight">Verification Failed</h2>
          <p className="text-gray-500 font-bold text-sm">Link expire ho chuka hai ya token invalid hai.</p>
          <button 
            onClick={() => router.push('/register')}
            className="w-full py-4 bg-[#00004d] text-white rounded-2xl font-black text-xs tracking-widest mt-4"
          >
            BACK TO REGISTER
          </button>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <Toaster position="top-center" />
      <Suspense fallback={
        <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00004d] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Verification...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}