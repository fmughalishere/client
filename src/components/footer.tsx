"use client";
import Link from 'next/link';
import Image from 'next/image';
import { IoLogoFacebook } from "react-icons/io";
import { GrLinkedin } from "react-icons/gr";
import { FaTiktok } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f3ead8]">
      <div className="relative w-full h-[180px] md:h-[220px]">
        <Image 
          src="/images/IMG (1).jpeg" 
          alt="Illustration" 
          fill 
          className="object-cover object-top"
          priority
        />
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 px-4 z-10">
              <div className="flex items-center justify-between w-full max-w-[290px] mb-10">
               <Link href="https://facebook.com" target="_blank" className="text-[#1877F2]">
              <IoLogoFacebook size={25} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="flex items-center">
              <div className="bg-[#0a66c2] text-white p-[2px] rounded-[2px]">
                <GrLinkedin size={16} fill="currentColor" />
              </div>
            </Link>
            <Link 
              href="/help" 
              className="bg-[#00004d] text-white px-3 py-1 rounded-full text-[10px] font-normal shadow-md hover:bg-blue-900 transition-colors"
            >
              GET HELP
            </Link>
            <Link href="https://tiktok.com" target="_blank">
               <div className="bg-black text-white p-[4px] rounded-full flex items-center justify-center">
                  <FaTiktok size={13} fill="white" />
               </div>
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <div className="rounded-md p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center">
                 <FaInstagram size={17} />
              </div>
            </Link>        
          </div>
          <div className="text-center">
            <p className="text-[#1e3a8a] text-[12px] font-bold leading-tight">
              Copyright © 2026 <span className="underline decoration-green-400">easyjobs.pk</span>
            </p>
            <p className="text-[#1e3a8a] text-[10px] mt-0.5 opacity-90">
              A project of <span className="font-bold">Success Signatures SMC Pvt Ltd.</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;