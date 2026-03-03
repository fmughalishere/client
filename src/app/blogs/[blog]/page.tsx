"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import api from "../../../lib/axios";
import { ArrowLeft, Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";

export default function BlogDetailPage({ params }: { params: Promise<{ blog: string }> }) {
  const resolvedParams = React.use(params);
  const blogId = resolvedParams.blog;
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blogs/${blogId}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [blogId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={48} />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0f172a] text-white">
      <AlertCircle size={80} className="text-red-500 mb-6 animate-bounce" />
      <h1 className="text-4xl font-black mb-4 tracking-tight text-[#00d26a]">Post Not Found</h1>
      <p className="text-gray-400 font-bold mb-10 max-w-md">Article DB mein nahi mila.</p>
      <Link href="/blogs" className="bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-black shadow-xl">Back to All Blogs</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-20">
      <motion.div className="fixed top-20 left-0 right-0 h-1.5 bg-[#00d26a] origin-left z-[60]" style={{ scaleX }} />

      <section className="bg-slate-50 pt-12 pb-24 border-b">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 font-black mb-10 hover:text-[#1e3a8a] transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-[#00d26a] text-[#1e3a8a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block shadow-lg">{post.category}</span>
            <h1 className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-8 leading-tight tracking-tight">{post.title}</h1>
            <div className="flex gap-6 text-sm font-bold text-gray-400">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-[#00d26a]" /> {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-16 -mt-32 z-10 border-8 border-white">
            <img src={post.image || "https://via.placeholder.com/1200x600"} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <article className="flex-1">
              <div 
                className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}