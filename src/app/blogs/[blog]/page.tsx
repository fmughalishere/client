"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, Calendar, User, Clock, Share2, 
  Facebook, Twitter, Linkedin, Bookmark,
  MessageCircle, ChevronRight, Briefcase, AlertCircle
} from "lucide-react";

const allBlogPosts = [
  {
    id: "1",
    title: "How to Crack Your Next Tech Interview in Pakistan",
    category: "Interview Tips",
    author: "Zeeshan Khan",
    authorRole: "Senior Recruiter @ TechFlow",
    date: "Feb 24, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&h=600&fit=crop",
    content: `
      <p class="text-xl text-gray-600 leading-relaxed mb-8 font-medium">Tech interviews in Pakistan's growing ecosystem are becoming more competitive. Whether you are applying to a startup in Lahore or a multinational in Karachi, preparation is key.</p>
      <h2 class="text-3xl font-black text-[#1e3a8a] mb-6 font-jakarta">1. Master the Fundamentals</h2>
      <p class="text-gray-600 mb-8 leading-relaxed">Most interviewers start with Data Structures and Algorithms. Practice drawing architecture diagrams for senior roles.</p>
      <div class="bg-green-50 p-8 rounded-[2rem] border-l-8 border-[#00d26a] mb-10 font-jakarta">
        <h4 class="text-[#1e3a8a] font-black mb-2 italic">Pro Tip: "Don't just code; explain your thought process."</h4>
      </div>
    `
  },
  {
    id: "2",
    title: "Top 10 High-Paying Remote Jobs for 2026",
    category: "Career Advice",
    author: "Amna Ahmed",
    authorRole: "HR Consultant",
    date: "Feb 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&h=600&fit=crop",
    content: `
      <p class="text-xl text-gray-600 leading-relaxed mb-8 font-medium">Remote work is no longer just a trend; it's the future of the global economy.</p>
      <h2 class="text-3xl font-black text-[#1e3a8a] mb-6 font-jakarta">Software Development & AI</h2>
      <p class="text-gray-600 mb-8 leading-relaxed">Software engineering remains the king of remote work. Companies in US and Europe are hiring Pakistani developers at global rates.</p>
    `
  }
];

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const blogId = resolvedParams.id;
  
  const post = allBlogPosts.find(p => String(p.id) === String(blogId));

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0f172a] text-white">
        <AlertCircle size={80} className="text-red-500 mb-6 animate-bounce" />
        <h1 className="text-4xl font-black mb-4 tracking-tight text-[#00d26a]">Post Not Found</h1>
        <p className="text-gray-400 font-bold mb-10 max-w-md italic">Humne database mein talaash kiya magar ID: {blogId} ke liye koi article nahi mila.</p>
        <Link href="/blogs" className="bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-800 transition-all">
          Back to All Blogs
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <motion.div className="fixed top-20 left-0 right-0 h-1.5 bg-[#00d26a] origin-left z-[60]" style={{ scaleX }} />

      <section className="bg-slate-50 pt-12 pb-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 font-black mb-10 hover:text-[#1e3a8a] transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Blogs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-[#00d26a] text-[#1e3a8a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block shadow-lg">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1e3a8a] flex items-center justify-center text-white font-black text-xl shadow-xl">
                  {post.author[0]}
                </div>
                <div>
                  <div className="font-black text-[#1e3a8a]">{post.author}</div>
                  <div className="text-xs font-bold text-gray-400">{post.authorRole}</div>
                </div>
              </div>
              <div className="flex gap-6 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-2"><Calendar size={18} className="text-[#00d26a]" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-[#00d26a]" /> {post.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[300px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mb-16 -mt-32 z-10 border-8 border-white"
          >
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="lg:w-20 shrink-0">
              <div className="lg:sticky lg:top-40 flex lg:flex-col gap-4 justify-center items-center">
                {[Facebook, Twitter, Linkedin, MessageCircle, Bookmark].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 rounded-2xl bg-slate-50 text-gray-400 hover:bg-[#1e3a8a] hover:text-white transition-all flex items-center justify-center shadow-sm">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </aside>

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