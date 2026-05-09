"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmail() {
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
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster />
      <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-md w-full">
        {status === "verifying" && (
          <div>
            <div className="w-12 h-12 border-4 border-[#00004d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">Verifying your email...</h2>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-[#00004d]">Verified!</h2>
            <p className="text-gray-500 mt-2">Redirecting to login page...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <div className="text-red-500 text-5xl mb-4">⚠</div>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-500 mt-2">The link is invalid or has expired.</p>
          </div>
        )}
      </div>
    </div>
  );
}