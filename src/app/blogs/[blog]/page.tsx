"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import api from "../../../lib/axios";
import { ArrowLeft, Calendar, AlertCircle, Loader2, User } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#000a31] mb-4" size={40} />
        <p className="text-[10px] font-black  tracking-widest text-gray-400">Loading Article...</p>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <AlertCircle size={60} className="text-red-500 mb-6" />
      <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-[#000a31]">Post Not Found</h1>
      <p className="text-gray-400 font-bold mb-10 max-w-md text-sm md:text-base">Humein ye article database mein nahi mila.</p>
      <Link href="/blogs" className="bg-[#000a31] text-white px-8 py-4 rounded-full font-black shadow-xl active:scale-95 transition-all">
        Back to All Blogs
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-20">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 md:h-1.5 bg-[#00d26a] origin-left z-[100]" 
        style={{ scaleX }} 
      />

      <section className="bg-slate-50 pt-10 md:pt-16 pb-24 md:pb-32 border-b border-gray-100 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 font-black mb-8 md:mb-12 hover:text-[#000a31] transition-all group text-[10px] md:text-xs  tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-[#00d26a] text-[#000a31] px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black  tracking-widest mb-6 inline-block shadow-sm">
              {post.category || "Insight"}
            </span>
            
            <h1 className="text-3xl md:text-6xl font-black text-[#000a31] mb-8 leading-[1.1] tracking-tight">
              {post.title}
            </h1>
               <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] md:text-xs font-bold text-gray-400  tracking-wide">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-[#00d26a]" /> 
                {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} className="text-[#00d26a]" /> 
                {post.author || "EasyJobs Team"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="relative px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative h-[220px] md:h-[450px] lg:h-[500px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 md:mb-20 -mt-16 md:-mt-24 z-10 border-[6px] md:border-[10px] border-white"
          >
            <img 
              src={post.image || "https://via.placeholder.com/1200x600"} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-12">
            <article className="flex-1 w-full overflow-hidden">
              <div 
                className="blog-content prose prose-slate md:prose-lg max-w-none text-gray-600 font-medium leading-relaxed
                prose-headings:text-[#000a31] prose-headings:font-black prose-p:mb-6 prose-strong:text-[#000a31]
                prose-img:rounded-3xl prose-a:text-[#00d26a] prose-a:font-bold hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>
             <div className="mt-16 pt-10 border-t border-gray-100 flex justify-center">
            <Link href="/blogs" className="text-[#000a31] font-black  text-xs tracking-widest hover:text-[#00d26a] flex items-center gap-2 transition-colors">
              <ArrowLeft size={16} /> Read More Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}