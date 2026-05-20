"use client";
import Link from 'next/link';
import Image from 'next/image';
import { GrLinkedin } from "react-icons/gr";
import { FaTiktok } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="relative w-full aspect-[1563/531]">
        <Image
          src="/images/footer-img.png"
          alt="Illustration"
          fill
          className="object-contain"
          priority
        />
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-[2%] px-4 z-10">
          <div className="flex items-center justify-between w-full max-w-[280px] sm:max-w-[350px] mb-[2%]">
            <Link href="https://facebook.com" target="_blank" className="text-[#0070f3]">
              <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="flex items-center">
              <div className="bg-[#0a66c2] text-white p-[2px] rounded-[2px]">
                <GrLinkedin className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" />
              </div>
            </Link>
            <Link
              href="/help"
              className="bg-[#5DBB63] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-[9px] text-[8px] sm:text-[10px] font-bold shadow-md"
            >
              GET HELP
            </Link>
            <Link href="https://tiktok.com" target="_blank">
              <div className="bg-black text-white p-[3px] sm:p-1 rounded-full flex items-center justify-center">
                <FaTiktok className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="white" />
              </div>
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <div className="rounded-md p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center">
                <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </Link>
          </div>
          <div className="text-center mt-1">
            <p className="text-[#1e3a8a] text-[8px] sm:text-[10px] font-bold leading-tight">
              Copyright © 2026 <span className="underline decoration-green-400">easyjobs.pk</span>
            </p>
            <p className="text-[#1e3a8a] text-[8px] sm:text-[10px] mt-0.5 opacity-90">
             <span className="font-bold uppercase">A project of Success Signatures (SMC Pvt) Ltd. Lahore-Pakistan</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;