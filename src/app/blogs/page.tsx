"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "../../lib/axios";
import { 
  Search, Calendar, User, ArrowRight, Clock, BookOpen, Loader2 
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
    <main className="min-h-screen bg-[#f8fafc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-[#1e3a8a]/5 px-4 py-2 rounded-full text-[#1e3a8a] text-sm font-black mb-6 border border-[#1e3a8a]/10">
            <BookOpen size={16} className="text-[#00d26a]" />
            <span className="uppercase tracking-widest">EasyJobs Career Insights</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6">Latest <span className="text-[#00d26a]">Blogs</span> & News</h1>
          <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">Real-time insights from our database to help your career growth.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#1e3a8a] mb-4" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Fetching Articles...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogs.map((post: any, index: number) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={post.image || "https://via.placeholder.com/600x400"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#00d26a] text-[#1e3a8a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{post.category}</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-grow flex-col">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#00d26a]" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#1e3a8a] mb-4 leading-tight group-hover:text-[#00d26a] transition-colors">{post.title}</h2>
                  <p className="text-gray-500 font-medium mb-8 line-clamp-2">{post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t">
                    <span className="text-sm font-black text-[#1e3a8a]">{post.author || "EasyJobs Team"}</span>
                    <Link href={`/blogs/${post._id}`} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all"><ArrowRight size={24} /></Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 font-bold text-gray-400">No blogs found in database.</div>
        )}
      </div>
    </main>
  );
}