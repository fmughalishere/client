"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessModal({ isOpen, onClose, title, message }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 50 }} 
            className="relative w-full max-w-[340px] md:max-w-sm bg-white rounded-[30px] p-6 md:p-8 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 size={40} className="text-green-500 md:w-12 md:h-12" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#00004d] mb-2">{title}</h3>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed">{message}</p>
            <button 
              onClick={onClose} 
              className="w-full bg-[#00004d] text-white py-4 rounded-full font-black text-sm md:text-base active:scale-95 transition-transform"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}