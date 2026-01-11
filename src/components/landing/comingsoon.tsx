"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { 
  PawPrint, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Search,
  Users,
  Bird,
  Fish,
  Cat,
  Dog,
  Turtle,
  Sparkles,
  ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// --- Professional UI Components ---

const Button = ({ children, className = "", variant = "primary", size = "md", icon: Icon, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 focus:outline-none";
  
  const variants: any = {
    primary: "bg-[#606c38] text-white shadow-xl shadow-[#606c38]/20 hover:bg-[#4d562d] hover:shadow-2xl hover:shadow-[#606c38]/30 hover:-translate-y-0.5",
    secondary: "bg-[#dda15e] text-white shadow-xl shadow-[#dda15e]/20 hover:bg-[#bc8a51] hover:shadow-2xl hover:shadow-[#dda15e]/30 hover:-translate-y-0.5",
    ghost: "hover:bg-gray-100 text-gray-900",
    outline: "border-2 border-[#606c38] text-[#606c38] hover:bg-[#606c38] hover:text-white"
  };
  
  const sizes: any = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-10 py-5 text-lg"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
      {Icon && <Icon className="ml-2.5 w-5 h-5" />}
    </button>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg sm:text-xl font-bold transition-colors ${isOpen ? 'text-[#606c38]' : 'text-gray-900 group-hover:text-[#606c38]'}`}>
          {question}
        </span>
        <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-[#606c38] text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
          <ChevronDown size={20} />
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
            <p className="pb-6 text-gray-500 font-medium leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input 
    className={`flex h-16 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-6 py-2 text-lg transition-all placeholder:text-gray-400 focus:bg-white focus:border-[#606c38]/40 focus:outline-none shadow-inner ${className}`} 
    {...props} 
  />
);

// Helper for local storage persistence
function addToWaitlist(email: string): number {
    if (typeof window === 'undefined') return 0;
    const list = JSON.parse(localStorage.getItem("waitlist") || "[]");
    const emailExists = list.some((item: any) => item.email === email);
    if (emailExists) return list.length;

    list.push({
        email,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });

    localStorage.setItem("waitlist", JSON.stringify(list));
    return list.length;
}

export default function App() {
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
        const list = JSON.parse(localStorage.getItem("waitlist") || "[]");
        setCount(list.length);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const newCount = addToWaitlist(email);
        setCount(newCount);
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail("");
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#fcfcfb] text-[#1a1a18] font-sans selection:bg-[#606c38] selection:text-white">
            {/* Soft Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#606c38]/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#dda15e]/5 rounded-full blur-[120px]" />
            </div>

            {/* --- Navigation --- */}
            <nav className="relative z-50 max-w-7xl mx-auto px-6 lg:px-12 py-10 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="bg-[#606c38] p-2.5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <PawPrint size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black  tracking-tighter uppercase text-[#606c38]">PetNest</span>
                </div>
                
                <div className="hidden lg:flex items-center gap-10">
                    {['Safety', 'Breeding Standards', 'Marketplace', 'Support'].map((item) => (
                        <span key={item} className="text-sm font-bold text-gray-500 hover:text-[#606c38] cursor-pointer transition-colors uppercase tracking-widest">{item}</span>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                            <Button variant="ghost" className="text-sm font-medium">
                                Login
                            </Button>
                    </Link>
                    <Link href="/signup">
                            <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                                Join Now
                            </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10">
                {/* --- Hero Section --- */}
                <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-32">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-10 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-100 text-[#606c38] text-[13px] font-extrabold uppercase tracking-widest shadow-sm"
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
                              <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-black leading-[0.9] sm:leading-[0.85] tracking-tighter">
                                Discover a love <br className="hidden sm:block" />
                                <span className="text-[#606c38] relative inline-block italic">
                                    that lasts.
                                    <span className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 bg-[#dda15e]/30 rounded-full -z-10" />
                                </span>
                              </h1>
                              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-400">Find your soulmate on PetNest.</p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-base sm:text-xl lg:text-2xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
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
                                        className="flex flex-col sm:flex-row gap-4 p-3 bg-white border border-gray-100 rounded-[28px] max-w-lg mx-auto lg:mx-0 shadow-2xl transition-all group focus-within:ring-4 ring-[#606c38]/5"
                                    >
                                        <Input
                                            type="email"
                                            className="bg-transparent border-none shadow-none h-14"
                                            placeholder="Your email address"
                                            value={email}
                                            onChange={(e: any) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            variant="primary"
                                            size="lg"
                                            className="whitespace-nowrap rounded-[20px]"
                                            icon={ArrowRight}
                                        >
                                            {isLoading ? "Wait..." : "Join the Nest"}
                                        </Button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-6 p-6 bg-[#606c38] text-white rounded-[32px] max-w-lg mx-auto lg:mx-0 shadow-2xl"
                                    >
                                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xl font-bold">You're on the list!</p>
                                            <p className="opacity-80 font-medium">Spot #{(count || 0) + 1242} is yours. Stay tuned.</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <img
                                                key={i} 
                                                src={`https://i.pravatar.cc/100?u=user${i}`} 
                                                className="w-12 h-12 rounded-full border-4 border-white shadow-sm object-cover" 
                                                alt="User Profile"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm font-bold text-gray-400">
                                        <span className="text-gray-900">{count !== null ? count + 1200 : '1,540+'}</span> breeders and parents waiting.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Hero Visual Collage --- */}
                        <div className="lg:col-span-5 relative h-[700px] flex items-center justify-center">
                            {/* Main High-End Image */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                                transition={{ duration: 1 }}
                                className="relative w-full h-[600px] bg-white rounded-[60px] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] z-10 overflow-hidden"
                            >
                                <img 
                                    src="https://media.istockphoto.com/id/513317552/photo/puppy-and-kitten-and-guinea-pig.jpg?s=612x612&w=0&k=20&c=B5YHGLHmWp4L-kmy7d7MDWFJh1YF_GoYN3T0XZy3SjQ=" 
                                    className="w-full h-full object-cover rounded-[50px] transition-transform duration-700 hover:scale-105"
                                    alt="Healthy Happy Pets"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-12 left-12 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-[#dda15e] p-1.5 rounded-lg"><CheckCircle2 size={16} /></div>
                                        <span className="text-xs font-black uppercase tracking-widest">Platinum Breeder</span>
                                    </div>
                                    <h3 className="text-3xl font-black">Verified Listings</h3>
                                </div>
                            </motion.div>

                            {/* Floating Aquatic Card */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -left-12 w-64 h-44 bg-white p-3 rounded-[40px] shadow-2xl z-20 border border-gray-50"
                            >
                                <img 
                                    src="https://images.unsplash.com/photo-1618252903592-2b8c90c43a6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGhhbXN0ZXJ8ZW58MHx8MHx8fDA%3D" 
                                    className="w-full h-full object-cover rounded-[30px]" 
                                    alt="Tropical Fish"
                                />
                            </motion.div>

                            {/* Floating Interaction Card */}
                            <motion.div
                                animate={{ x: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 -right-16 bg-white p-6 rounded-[40px] shadow-2xl z-20 flex items-center gap-5 border border-gray-50 border-2 border-gray-100"
                            >
                                <div className="bg-[#606c38]/10 p-4 rounded-3xl text-[#606c38]">
                                    <MessageCircle size={28} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Direct Chat</p>
                                    <p className="text-base font-black text-gray-900">Talk to the owner</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* --- Categories Grid (All Pets) --- */}
                <section className="bg-white py-32">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-20 text-center">A marketplace for <br /> <span className="text-[#606c38]">everyone's family.</span></h2>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {[
                                { name: "Canines", icon: Dog, color: "text-blue-500", bg: "bg-blue-50", img: "https://plus.unsplash.com/premium_photo-1676389281733-aaefab0e7907?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG9nc3xlbnwwfHwwfHx8MA%3D%3D" },
                                { name: "Felines", icon: Cat, color: "text-purple-500", bg: "bg-purple-50", img: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGNhdHN8ZW58MHx8MHx8fDA%3D" },
                                { name: "Exotics", icon: Bird, color: "text-yellow-600", bg: "bg-yellow-50", img: "https://plus.unsplash.com/premium_photo-1669673985973-089e66c70651?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGV4b3RpYyUyMGJpcmRzfGVufDB8fDB8fHww" },
                                { name: "Aquatics", icon: Fish, color: "text-cyan-500", bg: "bg-cyan-50", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400" },
                                { name: "Reptiles", icon: Turtle, color: "text-emerald-600", bg: "bg-emerald-50", img: "https://images.unsplash.com/photo-1750144547148-56a3c4bed7b6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -12 }}
                                    className="group relative h-[380px] rounded-[45px] overflow-hidden cursor-pointer shadow-xl transition-all"
                                >
                                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-10 left-0 right-0 text-center">
                                        <h4 className="text-white font-black text-2xl uppercase tracking-tighter">{item.name}</h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- The PetNest Pledge (Professional Depth) --- */}
                <section className="py-32 bg-[#fcfcfb]">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <img src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-72 object-cover rounded-[40px] shadow-lg" alt="Happy pet" />
                                    <div className="bg-[#606c38] p-10 rounded-[40px] text-white shadow-2xl">
                                        <Users size={40} className="mb-6 opacity-40" />
                                        <h4 className="text-3xl font-black mb-2 leading-tight">12k+</h4>
                                        <p className="font-bold opacity-80 text-sm uppercase tracking-widest">Active Community</p>
                                    </div>
                                </div>
                                <div className="space-y-6 pt-12">
                                    <div className="bg-[#dda15e] p-10 rounded-[40px] text-white shadow-2xl">
                                        <ShieldCheck size={40} className="mb-6 opacity-40" />
                                        <h4 className="text-3xl font-black mb-2 leading-tight">100%</h4>
                                        <p className="font-bold opacity-80 text-sm uppercase tracking-widest">Verified Ads</p>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1673487069586-0ade08b52e0a?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="w-full h-72 object-cover rounded-[40px] shadow-lg" alt="Breeder care" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10 order-1 lg:order-2">
                            <div className="inline-block px-5 py-2 rounded-full bg-[#606c38]/10 text-[#606c38] font-black text-xs uppercase tracking-[0.2em]">Our Standards</div>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Ethical breeding <br /> is our obsession.</h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                Unlike other marketplaces, PetNest is built by pet parents, for pet parents. We verify government documents, conduct spot checks, and listen to the community.
                            </p>
                            
                            <ul className="space-y-6">
                                {[
                                    { title: "Identity Verification", desc: "Every breeder is manually verified via Aadhaar/PAN." },
                                    { title: "No Commercial Mills", desc: "We strictly ban large-scale puppy and bird mills." },
                                    { title: "Post-Adoption Support", desc: "Our network of local vets is always one click away." }
                                ].map((pledge, i) => (
                                    <li key={i} className="flex gap-6 items-start group">
                                        <div className="bg-white border-2 border-gray-100 p-3 rounded-2xl text-[#606c38] group-hover:bg-[#606c38] group-hover:text-white transition-colors duration-300">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h5 className="font-black text-xl mb-1">{pledge.title}</h5>
                                            <p className="text-gray-500 font-medium">{pledge.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <Button variant="outline" className="h-16 px-12 rounded-[24px]">Learn About Verification</Button>
                        </div>
                    </div>
                </section>

                 {/* --- FAQ Section --- */}
                <section className="py-20 sm:py-32 bg-white">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="text-center mb-16 sm:mb-20">
                      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-4 text-[#606c38]">Common Questions</h2>
                      <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Everything you need to know about PetNest</p>
                    </div>
                    
                    <div className="space-y-2">
                      <FAQItem 
                        question="How does PetNest verify breeders?" 
                        answer="Every seller on PetNest must complete a rigorous identity verification (KYC) process. We verify government-issued documents and, where applicable, breeding licenses to ensure only legitimate, ethical sellers can list on our platform."
                      />
                      <FAQItem 
                        question="Is there a fee for buying a pet?" 
                        answer="PetNest does not charge buyers any hidden fees. Our goal is to connect you directly with ethical sellers. Any transaction details are finalized directly between you and the verified seller via our direct messaging features."
                      />
                      <FAQItem 
                        question="What pets are available on PetNest?" 
                        answer="We feature a wide range of companions including dogs, cats, exotic birds, aquatic life, and reptiles. All listings are subject to our strict ethical guidelines which prohibit the sale of endangered or illegally obtained wildlife."
                      />
                      <FAQItem 
                        question="How do I communicate with sellers?" 
                        answer="Our platform provides a direct connection to verified sellers. Once you find a pet you are interested in, you can start a conversation instantly. This ensures transparent, real-time communication without middlemen."
                      />
                      <FAQItem 
                        question="What happens after I join the waitlist?" 
                        answer="As a waitlist member, you'll be the first to know when we launch in your area. You'll receive exclusive early access to the marketplace and special early-adopter badges for your profile."
                      />
                    </div>
                  </div>
                </section>

                {/* --- Massive CTA Section --- */}
                <section className="max-w-7xl mx-auto px-6 py-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[70px] bg-[#606c38] overflow-hidden p-16 md:p-32 text-center text-white"
                    >
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                            <PawPrint className="absolute -top-10 -left-10 w-64 h-64 -rotate-12" />
                            <PawPrint className="absolute -bottom-20 -right-20 w-96 h-96 rotate-12" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">Start your journey <br /> home today.</h2>
                            <p className="text-2xl opacity-80 font-medium">Join the thousands who found their best friend on PetNest. Secure your early access spot now.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                                <Button 
                                    variant="secondary"
                                    size="lg" 
                                    className="h-20 px-12 rounded-[28px] text-xl"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    icon={ArrowRight}
                                >
                                    Get Early Access
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="h-20 px-12 rounded-[28px] border-white/40 text-white hover:bg-white hover:text-[#606c38] text-xl"
                                >
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* --- Professional Designer Footer --- */}
            <footer className="w-full pt-32 pb-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-20 mb-24">
                        <div className="md:col-span-2 space-y-10">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#606c38] p-2.5 rounded-2xl text-white">
                                    <PawPrint size={28} />
                                </div>
                                <span className="text-3xl font-black tracking-tighter uppercase text-[#606c38]">PetNest</span>
                            </div>
                            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-sm">
                                Dedicated to creating safe, direct, and ethical pet marketplaces across Tamil Nadu. Every pet deserves a home.
                            </p>
                            <div className="flex gap-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center hover:bg-[#606c38] hover:text-white transition-all cursor-pointer shadow-sm group">
                                        <Heart size={24} className="group-hover:fill-current" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-lg font-black uppercase tracking-widest text-[#606c38]">Discover</h4>
                            <ul className="space-y-5 text-gray-500 font-bold text-lg">
                                <li className="hover:text-[#606c38] cursor-pointer">All Categories</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Verified Breeders</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Adoption Centers</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Success Stories</li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-lg font-black uppercase tracking-widest text-[#606c38]">Support</h4>
                            <ul className="space-y-5 text-gray-500 font-bold text-lg">
                                <li className="hover:text-[#606c38] cursor-pointer">Safety Guide</li>
                                <li className="hover:text-[#606c38] cursor-pointer">KYC Portal</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Help Center</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Breeding Ethics</li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-lg font-black uppercase tracking-widest text-[#606c38]">Contact</h4>
                            <ul className="space-y-5 text-gray-500 font-bold text-lg">
                                <li className="hover:text-[#606c38] cursor-pointer">Twitter (X)</li>
                                <li className="hover:text-[#606c38] cursor-pointer">Instagram</li>
                                <li className="hover:text-[#606c38] cursor-pointer">WhatsApp Support</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-gray-400 font-bold text-base">© 2025 PetNest Inc. Built for pet lovers, by pet parents.</p>
                        <div className="flex gap-10 font-black text-xs text-gray-400 uppercase tracking-widest">
                            <span className="hover:text-[#606c38] cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-[#606c38] cursor-pointer">Legal Terms</span>
                            <span className="hover:text-[#606c38] cursor-pointer">Cookie Settings</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}