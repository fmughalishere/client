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

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("App is already installed or not supported on this browser.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="relative z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/header_logo.png" 
                alt="EasyJobs.pk" 
                width={180} 
                height={50} 
                priority
                className="object-contain"
                style={{ height: 'auto' }}
              />
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-full text-[15px] font-semibold transition-all duration-300 relative group
                  ${pathname === link.href ? 'text-[#1e3a8a]' : 'text-gray-500 hover:text-[#1e3a8a]'}`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00d26a] rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 text-[#1e3a8a] hover:bg-slate-50 rounded-xl transition"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-[#00004d] text-white py-3 px-2 flex justify-around items-center w-full">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all">
          <AiFillHome size={18} className="shrink-0 text-white" />
          <span className="text-[10px] sm:text-[13px] font-bold whitespace-nowrap tracking-tight">
            Home
          </span>
        </Link>

        <Link href="/dashboard" className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all">
          <FaUserGear size={18} className="shrink-0 text-white" />
          <span className="text-[10px] sm:text-[13px] font-bold whitespace-nowrap tracking-tight">
            My Control Panel
          </span>
        </Link>

        <button 
          onClick={handleInstallClick}
          className="flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all outline-none"
        >
          <PlusCircle size={18} className="shrink-0 text-white" />
          <span className="text-[10px] sm:text-[13px] font-bold whitespace-nowrap tracking-tight">
            Add to home screen
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-bold ${
                    pathname === link.href
                      ? 'bg-blue-50 text-[#1e3a8a]'
                      : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;