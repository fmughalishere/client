"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PlusCircle, Bell } from "lucide-react";
import { AiFillHome } from "react-icons/ai";
import { FaUserGear } from "react-icons/fa6";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find Jobs", href: "/jobs" },
  { name: "Overseas Jobs", href: "/jobs/foreign" },
  { name: "Blogs", href: "/blogs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBox, setShowInstallBox] = useState(false);

  const [dashboardLink, setDashboardLink] = useState("/login");

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === "employer") setDashboardLink("/dashboard/employer");
        else if (user.role === "jobseeker") setDashboardLink("/dashboard/jobseeker");
        else setDashboardLink("/dashboard");
      } catch {
        setDashboardLink("/login");
      }
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Install option not available");
      return;
    }

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted install");
    }

    setDeferredPrompt(null);
    setShowInstallBox(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  const handleWhatsAppShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, "_blank");
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  return (
    <header className="relative z-50 w-full bg-white border-b shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/images/nav-logo.png"
            alt="Logo"
            width={170}
            height={50}
            className="object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-[14px] font-semibold transition ${
                pathname === link.href
                  ? "text-blue-900 bg-blue-50"
                  : "text-gray-500 hover:text-blue-800 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-3 mt-2 rounded-full hover:bg-gray-100 transition">
            <Bell size={26} className="text-[#00004d]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#00004d]"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>
      <div className="bg-[#00004d] text-white flex items-center justify-around py-2 text-[10px]">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80">
          <AiFillHome size={18} style={{ color: "#5DBB63" }} />
          Home
        </Link>
        <div className="w-[1px] h-4 bg-white"></div>
        <Link href={dashboardLink} className="flex items-center gap-1 hover:opacity-80">
          <FaUserGear size={18} style={{ color: "#5DBB63" }} />
          My Control Panel
        </Link>

        <div className="w-[1px] h-4 bg-white"></div>

        <button
          onClick={() => setShowInstallBox(true)}
          className="flex items-center gap-1 hover:opacity-80"
        >
          <PlusCircle size={18} style={{ color: "#5DBB63" }} />
          Add to Home Screen
        </button>
      </div>
      <AnimatePresence>
        {showInstallBox && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.25 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl w-[300px] text-center shadow-2xl"
            >
              <div className="flex justify-center mb-3">
                <div className="bg-[#00004d]/10 p-3 rounded-full">
                  <PlusCircle size={28} className="text-[#00004d]" />
                </div>
              </div>
              <h2 className="font-bold text-lg text-[#00004d]">
                Install App
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Get quick access & better experience
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full bg-[#00004d] text-white py-2.5 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
              >
                Add to Home Screen
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full mt-2 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition"
              >
                Copy Link
              </button>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-[1px] bg-gray-200"></div>
                <span className="text-xs text-gray-400">share</span>
                <div className="flex-1 h-[1px] bg-gray-200"></div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-green-500 hover:scale-110 transition p-3 rounded-full text-white shadow"
                >
                  <FaWhatsapp size={20} />
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="bg-blue-600 hover:scale-110 transition p-3 rounded-full text-white shadow"
                >
                  <FaFacebook size={20} />
                </button>
              </div>
              <button
                onClick={() => setShowInstallBox(false)}
                className="mt-4 text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-white shadow-lg absolute w-full"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href={dashboardLink}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-900 font-semibold"
              >
                Control Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;