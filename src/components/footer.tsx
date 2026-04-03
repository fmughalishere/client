"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { AiFillTikTok } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f3ead8]">
      <div className="relative w-full h-[180px] md:h-[280px]">
        <Image 
          src="/images/IMG (1).png" 
          alt="Illustration" 
          fill 
          className="object-cover object-top"
          priority
        />
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-4 px-4 z-10">
                    <div className="flex items-center justify-between w-full max-w-sm mb-5">
            <Link href="https://facebook.com" target="_blank" className="text-[#1877F2]">
              <Facebook size={26} fill="currentColor" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="flex items-center gap-1">
              <div className="bg-[#0a66c2] text-white p-0.5 rounded-[2px]">
                <Linkedin size={14} fill="currentColor" strokeWidth={0} />
              </div>
            </Link>
            <Link 
              href="/help" 
              className="bg-[#1e3a8a] text-white px-6 py-1.5 rounded-full text-[12px] font-bold shadow-md hover:bg-blue-900 transition-colors"
            >
              HELP
            </Link>
            <Link href="https://tiktok.com" target="_blank" className="text-black">
               <div className="bg-black text-white p-1 rounded-full flex items-center justify-center">
                  <AiFillTikTok size={16} fill="white" />
               </div>
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <div className="rounded-lg p-0.5 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                 <Instagram size={22} />
              </div>
            </Link>        
          </div>
          <div className="text-center mt-2">
            <p className="text-[#1e3a8a] text-[13px] font-medium">
              Copyright © 2026 <span className="font-bold underline decoration-green-400">easyjobs.pk</span>
            </p>
            <p className="text-[#1e3a8a] text-[11px] mt-1">
              A project of <span className="font-bold">Success Signatures SMC Pvt Ltd.</span> All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;