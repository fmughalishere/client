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
      <div className="relative w-full h-[160px] sm:h-[180px] md:h-[220px] lg:h-[250px]">
        <Image
          src="/images/footer-img.png"
          alt="Illustration"
          fill
          className="object-fill"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 px-4 z-10">
          <div className="flex items-center justify-between w-full max-w-[320px] mb-8 sm:mb-10">
            <Link href="https://facebook.com" target="_blank" className="text-[#0070f3] hover:scale-110 transition-transform">
              <FaFacebook size={22} className="md:w-[25px] md:h-[25px]" />
            </Link>

            <Link href="https://linkedin.com" target="_blank" className="flex items-center hover:scale-110 transition-transform">
              <div className="bg-[#0a66c2] text-white p-[2px] rounded-[2px]">
                <GrLinkedin size={14} className="md:w-[16px] md:h-[16px]" fill="currentColor" />
              </div>
            </Link>
            <Link
              href="/help"
              className="bg-[#5DBB63] text-white px-3 py-1 rounded-[9px] text-[9px] md:text-[10px] font-bold shadow-md hover:bg-[#4da854] transition-colors"
            >
              GET HELP
            </Link>

            <Link href="https://tiktok.com" target="_blank" className="hover:scale-110 transition-transform">
              <div className="bg-black text-white p-[4px] rounded-full flex items-center justify-center">
                <FaTiktok size={11} className="md:w-[13px] md:h-[13px]" fill="white" />
              </div>
            </Link>

            <Link href="https://instagram.com" target="_blank" className="hover:scale-110 transition-transform">
              <div className="rounded-md p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center">
                <FaInstagram size={15} className="md:w-[17px] md:h-[17px]" />
              </div>
            </Link>
          </div>
          <div className="text-center px-2">
            <p className="text-[#1e3a8a] text-[9px] md:text-[11px] font-bold leading-tight">
              Copyright © 2026 <span className="underline decoration-green-400">easyjobs.pk</span>
            </p>
            <p className="text-[#1e3a8a] text-[9px] md:text-[10px] mt-1 opacity-90 max-w-[250px] md:max-w-full mx-auto">
              <span className="font-bold">A project of Success Signatures (SMC Pvt) Ltd. Lahore-Pakistan</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;