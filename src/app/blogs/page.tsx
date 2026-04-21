"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "../../lib/axios";
import { 
  Calendar, ArrowRight, BookOpen, Loader2 
} from "lucide-react";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-8 md:mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00d26a] font-black  text-[10px] md:text-xs tracking-widest hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="text-center mb-12 md:mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-2 bg-[#000a31]/5 px-4 py-2 rounded-full text-[#000a31] text-[10px] md:text-xs font-black mb-6 border border-[#000a31]/10  tracking-widest"
          >
            <BookOpen size={14} className="text-[#00d26a]" />
            <span>Career Insights</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-6xl font-black text-[#000a31] mb-4 md:mb-6 leading-tight">
            Latest <span className="text-[#00d26a]">Blogs</span> & News
          </h1>
          <p className="text-gray-500 font-bold text-sm md:text-lg max-w-2xl mx-auto px-4">
            Real-time insights and professional tips to help your career growth in Pakistan.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#000a31] mb-4" size={40} />
            <p className="text-gray-400 font-black  tracking-widest text-[10px]">Fetching Articles...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {blogs.map((post: any, index: number) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-56 md:h-72 overflow-hidden">
                  <img 
                    src={post.image || "https://via.placeholder.com/600x400"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6">
                    <span className="bg-[#00d26a] text-[#000a31] px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black  tracking-widest shadow-lg">
                      {post.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-10 flex flex-grow flex-col">
                  <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold text-gray-400 mb-4  tracking-wide">
                    <Calendar size={14} className="text-[#00d26a]" /> 
                    {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-black text-[#000a31] mb-4 leading-snug group-hover:text-[#00d26a] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-500 text-xs md:text-sm font-medium mb-8 line-clamp-3 md:line-clamp-2 leading-relaxed">
                    {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[9px]  font-bold text-gray-400 tracking-widest">Posted by</span>
                      <span className="text-xs md:text-sm font-black text-[#000a31]">{post.author || "EasyJobs Team"}</span>
                    </div>
                    
                    <Link 
                      href={`/blogs/${post._id}`} 
                      className="w-10 h-10 md:w-12 md:h-12 bg-[#000a31] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#00d26a] group-hover:text-[#000a31] transition-all active:scale-90"
                    >
                      <ArrowRight size={22} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="bg-white p-12 rounded-[3rem] inline-block shadow-sm border border-gray-50">
                <p className="font-bold text-gray-400  text-xs tracking-widest">No blogs found in database.</p>
             </div>
          </div>
        )}
      </div>
    </main>
  );
}