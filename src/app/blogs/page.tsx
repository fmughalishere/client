"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Tag, 
  Clock, 
  ChevronRight,
  TrendingUp,
  BookOpen
} from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "How to Crack Your Next Tech Interview in Pakistan",
    excerpt: "Learn the top strategies and common questions asked by leading tech firms in Karachi and Lahore.",
    author: "Zeeshan Khan",
    date: "Feb 24, 2026",
    readTime: "8 min read",
    category: "Interview Tips",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Top 10 High-Paying Remote Jobs for 2026",
    excerpt: "Discover the best industries offering high-salary remote opportunities that you can do from anywhere.",
    author: "Amna Ahmed",
    date: "Feb 22, 2026",
    readTime: "6 min read",
    category: "Career Advice",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&h=400&fit=crop"
  },
  {
    id: 3,
    title: "The Rise of AI in the Pakistani Job Market",
    excerpt: "How Artificial Intelligence is reshaping recruitment and what skills you need to stay relevant.",
    author: "Dr. Faisal",
    date: "Feb 20, 2026",
    readTime: "10 min read",
    category: "Tech Trends",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Writing a Resume that Gets You Noticed by Top Employers",
    excerpt: "Practical tips to optimize your CV for ATS systems and catch the eye of premium hiring managers.",
    author: "Sarah Ali",
    date: "Feb 18, 2026",
    readTime: "5 min read",
    category: "Resume Guide",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&h=400&fit=crop"
  }
];

export default function BlogsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#1e3a8a]/5 px-4 py-2 rounded-full text-[#1e3a8a] text-sm font-black mb-6 border border-[#1e3a8a]/10"
          >
            <BookOpen size={16} className="text-[#00d26a]" />
            <span className="uppercase tracking-widest">EasyJobs Career Insights</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6 tracking-tight"
          >
            Latest <span className="text-[#00d26a]">Blogs</span> & News
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 font-bold text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Expert advice, industry trends, and success stories to help you navigate your career path in Pakistan.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 max-w-xl mx-auto relative group"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Search articles, tips, or trends..." 
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border-2 border-transparent focus:border-[#1e3a8a] outline-none font-bold text-[#1e3a8a] transition-all"
            />
          </motion.div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["All Posts", "Interview Tips", "Career Advice", "Tech Trends", "Resume Guide"].map((cat, i) => (
            <button key={i} className={`px-6 py-2 rounded-full font-black text-sm transition-all border-2 
              ${i === 0 ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-lg' : 'bg-white text-gray-400 border-slate-100 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-[#1e3a8a]/10 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-[#00d26a] text-[#1e3a8a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#00d26a]" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#00d26a]" /> {post.readTime}</span>
                </div>

                <h2 className="text-2xl font-black text-[#1e3a8a] mb-4 leading-tight group-hover:text-[#00d26a] transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-500 font-medium mb-8 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#1e3a8a] font-black overflow-hidden">
                       <User size={20} />
                    </div>
                    <span className="text-sm font-black text-[#1e3a8a]">{post.author}</span>
                  </div>
                  <Link href={`/blogs/${post.id}`} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={24} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 bg-[#1e3a8a] rounded-[4rem] relative overflow-hidden flex flex-col items-center text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d26a]/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
          <div className="relative z-10 max-w-2xl">
            <TrendingUp className="text-[#00d26a] mx-auto mb-6" size={48} />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Stay ahead of the curve</h2>
            <p className="text-blue-100 font-bold mb-10">Subscribe to our newsletter and get the latest career tips and job market news delivered directly to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-white font-bold placeholder:text-blue-200/50"
              />
              <button className="bg-[#00d26a] hover:bg-green-600 text-[#1e3a8a] px-10 py-4 rounded-2xl font-black transition-all whitespace-nowrap">
                Join Now
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}