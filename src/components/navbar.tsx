"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PlusCircle } from 'lucide-react';
import { AiFillHome } from "react-icons/ai";
import { FaUserGear } from "react-icons/fa6";

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Find Jobs', href: '/jobs' },
  { name: 'Overseas Jobs', href: '/jobs/foreign' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dashboardLink, setDashboardLink] = useState("/login");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === "employer") {
          setDashboardLink("/dashboard/employer");
        } else if (user.role === "jobseeker") {
          setDashboardLink("/dashboard/jobseeker");
        } else {
          setDashboardLink("/dashboard");
        }
      } catch (error) {
        console.error("Error parsing user data", error);
        setDashboardLink("/login");
      }
    } else {
      setDashboardLink("/login");
    }

    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
  };

  return (
    <header className="relative z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <Link href="/">
          <Image 
            src="/images/header-logo.png" 
            alt="Logo" 
            width={180} 
            height={50} 
            priority 
            className="object-contain"
            style={{ height: 'auto' }}
          />
        </Link>
        <div className="hidden md:flex space-x-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`px-4 py-2 rounded-full text-[15px] font-semibold ${pathname === link.href ? 'text-[#1e3a8a]' : 'text-gray-500'}`}>
              {link.name}
            </Link>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[#1e3a8a]">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>
      <div className="bg-[#00004d] text-white py-1 px-0 flex justify-around items-center w-full">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-all">
          <AiFillHome size={18} />
          <span className="text-[10px] sm:text-[13px] whitespace-nowrap">Home</span>
        </Link>
        <div className="h-5 w-[1px] bg-white"></div> 
        <Link href={dashboardLink} className="flex items-center gap-1 hover:opacity-80 transition-all">
          <FaUserGear size={18} />
          <span className="text-[10px] sm:text-[13px] whitespace-nowrap">My Control Panel</span>
        </Link>
        <div className="h-5 w-[1px] bg-white"></div>
        <button onClick={handleInstallClick} className="flex items-center gap-1 hover:opacity-80 transition-all">
          <PlusCircle size={18} />
          <span className="text-[10px] sm:text-[13px] whitespace-nowrap">Add to Home Screen</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden bg-white absolute w-full shadow-xl">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-3 font-bold text-gray-600">
                  {link.name}
                </Link>
              ))}
              <Link href={dashboardLink} onClick={() => setIsOpen(false)} className="block px-4 py-3 font-bold text-[#1e3a8a] bg-blue-50 rounded-lg">
                My Control Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;