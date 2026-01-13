"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { 
  PawPrint, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Menu,
  X,
  Twitter,
  Instagram,
  MessageSquare,
  Globe,
  Sparkles,
  ChevronDown,
  Megaphone 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/**
 * Professional UI Components
 */

type ButtonProps = {
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant = "primary", size = "md", icon: Icon, className = "", ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 focus:outline-none whitespace-nowrap";
  
  const variants = {
    primary: "bg-[#606c38] text-white shadow-xl shadow-[#606c38]/20 hover:bg-[#4d562d] hover:shadow-2xl hover:shadow-[#606c38]/30 hover:-translate-y-0.5",
    secondary: "bg-[#dda15e] text-white shadow-xl shadow-[#dda15e]/20 hover:bg-[#bc8a51] hover:shadow-2xl hover:shadow-[#dda15e]/30 hover:-translate-y-0.5",
    ghost: "hover:bg-gray-100 text-gray-900",
    outline: "border-2 border-[#606c38] text-[#606c38] hover:bg-[#606c38] hover:text-white"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-[13px] sm:text-[14px]",
    md: "px-6 py-3 text-[14px] sm:text-[16px]",
    lg: "px-8 py-4 text-[16px] sm:text-[18px]"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {/* Moved Icon before children as requested */}
      {Icon && <Icon className="mr-2.5 w-4 h-4 sm:w-5 sm:h-5" />}
      {children}
    </button>
  );
};

const CurrentYear = new Date().getFullYear();

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 sm:py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-[16px] sm:text-[18px] font-bold transition-colors pr-4 ${isOpen ? 'text-[#606c38]' : 'text-gray-900 group-hover:text-[#606c38]'}`}>
          {question}
        </span>
        <div className={`p-1.5 sm:p-2 rounded-xl transition-all flex-shrink-0 ${isOpen ? 'bg-[#606c38] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[15px] sm:text-[16px] text-gray-500 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={`flex h-12 sm:h-16 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 sm:px-6 py-2 text-[14px] sm:text-[16px] transition-all placeholder:text-gray-400 focus:bg-white focus:border-[#606c38]/40 focus:outline-none shadow-inner ${className}`} 
    {...props} 
  />
);

type WaitlistEntry = {
  email: string;
  timestamp: string;
};

export default function App() {
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedWaitlist = localStorage.getItem("waitlist");
        const list: WaitlistEntry[] = storedWaitlist ? JSON.parse(storedWaitlist) : [];
        setCount(list.length);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        const storedWaitlist = localStorage.getItem("waitlist");
        const list: WaitlistEntry[] = storedWaitlist ? JSON.parse(storedWaitlist) : [];
        if (!list.some((item) => item.email === email)) {
            list.push({ email, timestamp: new Date().toISOString() });
            localStorage.setItem("waitlist", JSON.stringify(list));
        }
        
        setCount(list.length);
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail("");
    }

    if (!mounted) return <div className="min-h-screen bg-[#fcfcfb]" />;

    const navItems = ['Verified Sellers', 'Ethical Adoption', 'Marketplace', 'Support'];

    return (
        <div 
          className="min-h-screen bg-[#fcfcfb] text-[#1a1a18] font-['Poppins',sans-serif] selection:bg-[#606c38] selection:text-white overflow-x-hidden"
          suppressHydrationWarning
        >
            {/* Soft Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[80%] sm:w-[40%] h-[60%] bg-[#606c38]/5 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[80%] sm:w-[40%] h-[60%] bg-[#dda15e]/5 rounded-full blur-[80px] sm:blur-[120px]" />
            </div>

            {/* --- Navigation --- */}
            <nav className="sticky top-0 z-[100] bg-[#fcfcfb]/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                        <div className="bg-[#606c38] p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                            <PawPrint size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                        </div>
                        <span className="text-[16px] sm:text-[22px] font-black tracking-tighter uppercase text-[#606c38]">PetNest</span>
                    </div>
                    
                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                        {navItems.map((item) => (
                            <div key={item} className="relative group/nav">
                              <span 
                                  onClick={() => {
                                      if (item === 'Marketplace') {
                                          document.getElementById('market')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                  }}
                                  className="text-[16px] font-bold text-gray-500 group-hover/nav:text-[#606c38] cursor-pointer transition-colors py-2 block"
                              >
                                  {item}
                              </span>
                              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#606c38] transition-all duration-300 group-hover/nav:w-full group-hover/nav:left-0" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/login">
                            <Button variant="ghost" size="md" >Login</Button>
                            </Link>
                            
                        </div>
                        <Link href="/signup">
                        <Button className="hidden md:flex rounded-xl"  size="md">Sign UP</Button>
                        </Link>
                        <Button variant="outline" size="md" className="rounded-xl" icon={Megaphone}>Advertise</Button>
                        
                        <button 
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 flex flex-col gap-6 lg:hidden"
                        >
                            {navItems.map((item) => (
                                <span 
                                    key={item} 
                                    onClick={() => {
                                        if (item === 'Marketplace') {
                                            setMobileMenuOpen(false);
                                            document.getElementById('market')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    className="text-[18px] font-bold text-gray-800 border-b border-gray-50 pb-2 cursor-pointer hover:text-[#606c38] transition-colors"
                                >
                                    {item}
                                </span>
                            ))}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <Button variant="outline">Login</Button>
                                <Button variant="outline" size="sm" className="rounded-xl" icon={Megaphone}>Advertise</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="relative z-10">
                {/* --- Hero Section --- */}
                <section className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 sm:pt-20 pb-20 sm:pb-32 overflow-hidden lg:overflow-visible">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        <div className="lg:col-span-7 space-y-8 sm:space-y-10 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-100 text-[#606c38] text-[10px] sm:text-[12px] font-extrabold uppercase tracking-widest shadow-sm"
                            >
                                <Sparkles size={14} className="text-[#dda15e]" />
                                Tamil Nadu's Premier Pet Hub
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-4"
                            >
                                <h1 className="text-[28px] md:text-[32px] lg:text-[36px] font-black leading-[1.1] lg:leading-[0.9] tracking-tighter">
                                    Discover a love <br className="hidden sm:block" />
                                    <span className="text-[#606c38] relative inline-block italic">
                                        that lasts.
                                        <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-[#dda15e]/30 rounded-full -z-10" />
                                    </span>
                                </h1>
                                <p className="text-[14px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-bold text-gray-400">Find your soulmate on PetNest.</p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-[14px] md:text-[15px] lg:text-[16px] text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                            >
                                Meet <span className="text-black font-bold">verified ethical breeders</span> directly. Whether it's a pedigree pup or an exotic bird, find a companion who will love you forever in a safe, transparent marketplace.
                            </motion.p>

                            <div className="space-y-6">
                                {!isSubmitted ? (
                                    <motion.form
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        onSubmit={handleSubmit}
                                        className="flex flex-col sm:flex-row gap-3 p-2 bg-white border border-gray-100 rounded-[24px] sm:rounded-[28px] max-w-lg mx-auto lg:mx-0 shadow-2xl focus-within:ring-4 ring-[#606c38]/5"
                                    >
                                        <Input
                                            type="email"
                                            className="bg-transparent border-none shadow-none h-12 sm:h-14 w-full"
                                            placeholder="Your email address"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            variant="primary"
                                            size="lg"
                                            className="h-12 sm:h-14 rounded-2xl"
                                            icon={ArrowRight}
                                        >
                                            {isLoading ? "Wait..." : "Join Nest"}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-[#606c38] text-white rounded-[24px] sm:rounded-[32px] max-w-lg mx-auto lg:mx-0 shadow-2xl"
                                    >
                                        <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-md">
                                            <CheckCircle2 size={24} className="sm:w-8 sm:h-8" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[18px] font-bold">You're on the list!</p>
                                            <p className="text-[14px] opacity-80 font-medium">Spot #{(count || 0) + 1242} is yours. Stay tuned.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <img
                                                key={i} 
                                                src={`https://i.pravatar.cc/100?u=user${i}`} 
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white shadow-sm object-cover" 
                                                alt="User"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-[14px] font-bold text-gray-400">
                                        <span className="text-gray-900">{count !== null ? (count + 1200).toLocaleString() : '1,540+'}</span> breeders and parents waiting.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Hero Visual Collage --- */}
                        <div className="lg:col-span-5 relative h-[450px] sm:h-[600px] xl:h-[700px] flex items-center justify-center mt-12 lg:mt-0">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                                transition={{ duration: 1 }}
                                className="relative w-full max-w-[450px] lg:max-w-none h-full bg-white rounded-[40px] sm:rounded-[60px] p-3 sm:p-4 shadow-2xl z-10 overflow-hidden"
                            >
                                <img 
                                    src="https://media.istockphoto.com/id/513317552/photo/puppy-and-kitten-and-guinea-pig.jpg?s=612x612&w=0&k=20&c=B5YHGLHmWp4L-kmy7d7MDWFJh1YF_GoYN3T0XZy3SjQ=" 
                                    className="w-full h-full object-cover rounded-[35px] sm:rounded-[50px] transition-transform duration-700 hover:scale-105"
                                    alt="Pets"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#dda15e] p-1 rounded-md"><CheckCircle2 size={12} className="sm:w-4 sm:h-4" /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Platinum Breeder</span>
                                    </div>
                                    <h2 className="text-[20px] sm:text-[26px] font-black leading-tight">Verified Listings</h2>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="hidden sm:block absolute -top-4 -left-6 lg:-left-12 w-48 xl:w-64 h-32 xl:h-44 bg-white p-2 sm:p-3 rounded-[30px] xl:rounded-[40px] shadow-2xl z-20 border border-gray-100"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1618252903592-2b8c90c43a6e?w=600&auto=format&fit=crop&q=60" 
                                    className="w-full h-full object-cover rounded-[25px] xl:rounded-[30px]" 
                                    alt="Small Pet"
                                />
                            </motion.div>

                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-4 -right-4 lg:-right-12 w-48 xl:w-64 bg-white p-3 xl:p-6 rounded-[30px] xl:rounded-[40px] shadow-2xl z-20 flex items-center gap-3 xl:gap-5 border border-gray-100"
                            >
                                <div className="bg-[#606c38]/10 p-2 xl:p-4 rounded-xl xl:rounded-3xl text-[#606c38]">
                                    <MessageCircle size={20} className="xl:w-7 xl:h-7" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[8px] xl:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5 xl:mb-1">Direct Chat</p>
                                    <p className="text-[14px] xl:text-[16px] font-black text-gray-900 leading-tight">Talk to owner</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- Categories Grid --- */}
                <section id="market" className="bg-white py-20 sm:py-32">
                    <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
                        <h1 className="text-[18px] md:text-[26px] lg:text-[36px] font-black tracking-tighter mb-12 sm:mb-20 text-center leading-tight">
                            A marketplace for <br className="sm:hidden" /> <span className="text-[#606c38]">everyone's family.</span>
                        </h1>
                        
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
                            {[
                                { name: "Canines", img: "https://plus.unsplash.com/premium_photo-1676389281733-aaefab0e7907?w=600" },
                                { name: "Felines", img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600" },
                                { name: "Exotics", img: "https://plus.unsplash.com/premium_photo-1669673985973-089e66c70651?w=600" },
                                { name: "Aquatics", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600" },
                                { name: "Reptiles", img: "https://images.unsplash.com/photo-1750144547148-56a3c4bed7b6?q=80&w=600"}
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="group relative h-[300px] sm:h-[380px] xl:h-[450px] rounded-[35px] sm:rounded-[45px] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                                    <div className="absolute bottom-8 left-0 right-0 text-center">
                                        <h4 className="text-white font-black text-[16px] sm:text-[18px] md:text-[20px] uppercase tracking-tighter transition-transform duration-300 group-hover:scale-110">{item.name}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Pledge Section (Beautified) --- */}
                <section className="py-24 sm:py-32 bg-[#fcfcfb] relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-[#606c38]/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#dda15e]/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-20 lg:gap-24 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4 sm:gap-8">
                                <div className="space-y-4 sm:space-y-8">
                                    <motion.img 
                                        whileInView={{ opacity: 1, y: 0 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=600" 
                                        className="w-full h-56 sm:h-80 object-cover rounded-[32px] sm:rounded-[48px] shadow-xl border-4 border-white" 
                                        alt="Care" 
                                    />
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="bg-[#606c38] p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] text-white shadow-2xl relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10" />
                                        <Users size={32} className="sm:w-12 sm:h-12 mb-6 text-[#dda15e] group-hover:scale-110 transition-transform" />
                                        <h4 className="text-[24px] sm:text-[32px] font-black mb-1 leading-tight tracking-tight">12k+</h4>
                                        <p className="font-bold opacity-80 text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-white/90">Global Community</p>
                                    </motion.div>
                                </div>
                                <div className="space-y-4 sm:space-y-8 pt-12 sm:pt-20">
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="bg-[#dda15e] p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] text-white shadow-2xl relative overflow-hidden group"
                                    >
                                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8" />
                                        <ShieldCheck size={32} className="sm:w-12 sm:h-12 mb-6 text-[#606c38] group-hover:scale-110 transition-transform" />
                                        <h4 className="text-[24px] sm:text-[32px] font-black mb-1 leading-tight tracking-tight">100%</h4>
                                        <p className="font-bold opacity-80 text-[10px] sm:text-[12px] uppercase tracking-[0.2em] text-white/90">Verified Ads</p>
                                    </motion.div>
                                    <motion.img 
                                        whileInView={{ opacity: 1, y: 0 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        transition={{ delay: 0.2 }}
                                        src="https://images.unsplash.com/photo-1673487069586-0ade08b52e0a?q=80&w=600" 
                                        className="w-full h-56 sm:h-80 object-cover rounded-[32px] sm:rounded-[48px] shadow-xl border-4 border-white" 
                                        alt="Breeder" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 order-1 lg:order-2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#606c38]/10 text-[#606c38] font-black text-[11px] uppercase tracking-widest border border-[#606c38]/5 shadow-sm">
                                <Sparkles size={14} className="text-[#dda15e]" />
                                Our Pledge
                            </div>
                            <h1 className="text-[18px] md:text-[26px] lg:text-[36px] font-black tracking-tighter leading-tight text-gray-900">Ethical breeding <br className="hidden sm:block" /> is our obsession.</h1>
                            <p className="text-[14px] md:text-[16px] text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Built by pet parents, for pet parents. We verify government documents, conduct spot checks, and strictly monitor community feedback to ensure every listing meets our gold standard.
                            </p>
                            
                            <ul className="space-y-6 text-left max-w-xl mx-auto lg:mx-0">
                                {[
                                    { title: "Identity Verification", desc: "Every breeder verified via Aadhaar/PAN documentation." },
                                    { title: "No Commercial Mills", desc: "Strict ban on large-scale profit mills. Only home-raised pets." },
                                    { title: "Post-Adoption Support", desc: "Access to our network of certified local veterinary partners." }
                                ].map((pledge, i) => (
                                    <motion.li 
                                        key={i} 
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-5 sm:gap-6 items-start group"
                                    >
                                        <div className="flex-shrink-0 bg-white border-2 border-gray-100 p-2.5 sm:p-3 rounded-2xl text-[#606c38] group-hover:bg-[#606c38] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                                            <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-[16px] sm:text-[18px] mb-1 text-gray-900 group-hover:text-[#606c38] transition-colors">{pledge.title}</h5>
                                            <p className="text-[14px] sm:text-[15px] text-gray-500 font-medium leading-relaxed">{pledge.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Button variant="primary" size="lg" className="h-14 sm:h-16 px-12 rounded-[24px]">Safety Portal</Button>
                                <Button variant="outline" size="lg" className="h-14 sm:h-16 px-12 rounded-[24px]">Our Story</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FAQ Section --- */}
                <section className="py-20 sm:py-32 bg-white">
                  <div className="max-w-4xl mx-auto px-6 sm:px-8">
                    <div className="text-center mb-12 sm:mb-20">
                      <h1 className="text-[18px] md:text-[26px] lg:text-[36px] font-black tracking-tighter mb-4 text-[#606c38] leading-tight">Common Questions</h1>
                      <p className="text-gray-500 font-bold uppercase text-[16px] tracking-widest">Everything you need to know about PetNest</p>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                      <FAQItem 
                        question="How does PetNest verify breeders?" 
                        answer="Every seller on PetNest must complete a rigorous identity verification (KYC) process. We verify government-issued documents and breeding licenses to ensure only legitimate, ethical sellers can list."
                      />
                      <FAQItem 
                        question="Is there a fee for buying a pet?" 
                        answer="PetNest does not charge buyers any hidden fees. Our goal is to connect you directly. Any transaction details are finalized directly between you and the verified seller."
                      />
                      <FAQItem 
                        question="What pets are available on PetNest?" 
                        answer="Dogs, cats, exotic birds, aquatic life, and reptiles. All listings are subject to strict ethical guidelines which prohibit the sale of endangered wildlife."
                      />
                      <FAQItem 
                        question="How do I communicate with sellers?" 
                        answer="Our platform provides a direct, secure messaging system. Once you find a pet you are interested in, you can start a conversation instantly."
                      />
                    </div>
                  </div>
                </section>

                {/* --- Massive CTA Section --- */}
                <section className="max-w-[1800px] mx-auto px-4 sm:px-8 py-10 sm:py-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[40px] sm:rounded-[60px] xl:rounded-[80px] bg-[#606c38] overflow-hidden p-8 sm:p-16 lg:p-32 text-center text-white"
                    >
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                            <PawPrint className="absolute -top-10 -left-10 w-48 sm:w-96 h-48 sm:h-96 -rotate-12" />
                            <PawPrint className="absolute -bottom-20 -right-20 w-64 sm:w-[500px] h-64 sm:h-[500px] rotate-12" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-10">
                            <h2 className="text-[20px] md:text-[24px] lg:text-[36px] font-black tracking-tighter leading-tight">Start your journey <br /> home today.</h2>
                            <p className="text-[14px] md:text-[16px] opacity-80 font-medium max-w-2xl mx-auto">Join thousands who found their best friend on PetNest. Secure your early access spot now.</p>
                            
                            <div className="flex justify-center pt-4">
                                <Button 
                                    variant="secondary"
                                    size="lg" 
                                    className="h-14 sm:h-18 lg:h-20 px-8 sm:px-12 lg:px-16 rounded-2xl lg:rounded-3xl text-[14px] sm:text-[16px] xl:text-[18px]"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    icon={ArrowRight}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* --- Professional Footer --- */}
            <footer className="w-full pt-20 sm:pt-32 pb-12 sm:pb-16 bg-white border-t border-gray-100">
                <div className="max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 sm:gap-16 xl:gap-24 mb-16 sm:mb-24">
                        <div className="lg:col-span-2 space-y-8 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <div className="bg-[#606c38] p-2 rounded-xl text-white">
                                    <PawPrint size={24} />
                                </div>
                                <span className="text-[22px] font-black tracking-tighter uppercase text-[#606c38]">PetNest</span>
                            </div>
                            <p className="text-gray-400 text-[16px] font-medium leading-relaxed max-w-sm mx-auto sm:mx-0">
                                Creating safe, direct, and ethical pet marketplaces across Tamil Nadu. Every pet deserves a home.
                            </p>
                            <div className="flex justify-center sm:justify-start gap-3 sm:gap-4">
                                {[Twitter, Instagram, MessageSquare, Globe].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center hover:bg-[#606c38] hover:text-white transition-all shadow-sm group">
                                        <Icon size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5 transition-transform group-hover:scale-125" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="text-center sm:text-left space-y-6">
                            <h4 className="text-[14px] font-black uppercase tracking-widest text-[#606c38]">Discover</h4>
                            <ul className="space-y-4 text-gray-500 font-bold text-[14px]">
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Categories</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Breeders</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Adoption</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Stories</li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left space-y-6">
                            <h4 className="text-[14px] font-black uppercase tracking-widest text-[#606c38]">Support</h4>
                            <ul className="space-y-4 text-gray-500 font-bold text-[14px]">
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Safety</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">KYC Portal</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Help</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Ethics</li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left space-y-6">
                            <h4 className="text-[14px] font-black uppercase tracking-widest text-[#606c38]">Legal</h4>
                            <ul className="space-y-4 text-gray-500 font-bold text-[14px]">
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Terms</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Privacy</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Refunds</li>
                                <li className="hover:text-[#606c38] cursor-pointer transition-colors">Legal</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                        <p className="text-gray-400 font-bold text-[14px]">© {CurrentYear} PetNest Inc. Built for pet lovers, by pet parents.</p>
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 font-black text-[10px] text-gray-400 uppercase tracking-widest">
                            <span className="hover:text-[#606c38] cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-[#606c38] cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-[#606c38] cursor-pointer transition-colors">Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
