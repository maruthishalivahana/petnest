"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

import { PawPrint, ShieldCheck, MessageCircle, CheckCircle2, User } from "lucide-react";

import { motion } from "framer-motion";

function addToWaitlist(email: string): number {
    const list = JSON.parse(localStorage.getItem("waitlist") || "[]");

    // Check if email already exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailExists = list.some((item: any) => item.email === email);
    if (emailExists) {
        return list.length;
    }

    // Add new entry with timestamp
    list.push({
        email,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });

    localStorage.setItem("waitlist", JSON.stringify(list));
    return list.length;
}

export default function ComingSoon() {
    const [email, setEmail] = useState("");
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem("waitlist") || "[]");
        setCount(list.length);
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add to waitlist and get updated count
        const newCount = addToWaitlist(email);
        setCount(newCount);

        setIsLoading(false);
        setIsSubmitted(true);
        setEmail("");
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden relative">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />

                <nav className="relative z-50 px-6 md:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-[0_0_15px_rgba(96,108,56,0.3)]">
                            <PawPrint size={20} strokeWidth={3} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PetNest</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-4">
                            <span>Verified Sellers</span>
                            <span>Ethical Adoption</span>
                            <span className="text-primary">Coming Soon</span>
                        </div>
                        <Link href="/login">
                            <Button variant="ghost" className="text-sm font-medium">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </nav>

                <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-32 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 text-center md:text-left space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Launching in Tamil Nadu
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                            Find your new <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                                best friend.
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
                            The first <b className="text-accent">verified</b> pet marketplace. Connect directly with responsible breeders and sellers via WhatsApp. No middlemen. No scams.
                        </p>

                        <div className="mt-10 w-full max-w-md">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="h-12 flex-1 bg-secondary/30 border border-border rounded-xl"></div>
                                <div className="h-12 px-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
                                    Get Early Access
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                We care about your privacy. No spam, ever.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] hidden md:block"></div>
                </main>

                <footer className="absolute bottom-0 w-full py-6 border-t border-border">
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground">
                        <p>© 2025 PetNest Inc.</p>
                        <div className="flex gap-4">
                            <span className="hover:text-foreground cursor-pointer">Privacy</span>
                            <span className="hover:text-foreground cursor-pointer">Terms</span>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />


            <nav className="relative z-50 px-6 md:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-[0_0_15px_rgba(96,108,56,0.3)]">
                        <PawPrint size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">PetNest</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground mr-4">
                        <span>Verified Sellers</span>
                        <span>Ethical Adoption</span>
                        <span className="text-primary">Coming Soon</span>
                    </div>
                    <Link href="/login">
                        <Button variant="ghost" className="text-sm font-medium">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="text-sm font-medium bg-primary hover:bg-primary/90">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-32 flex flex-col md:flex-row items-center gap-16">

                {/* LEFT SIDE: Typography & Form */}
                <div className="flex-1 text-center md:text-left space-y-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Launching in Tamil Nadu
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight"
                    >
                        Find your new <br />
                        <span className=" bg-clip-text bg-gradient-to-r text-primary from-primary to-accent">
                            best friend.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed"
                    >
                        The first <b className="text-accent">verified</b> pet marketplace. Connect directly with responsible breeders and sellers via WhatsApp. No middlemen. No scams.
                    </motion.p>

                    {!isSubmitted ? (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0"
                        >
                            <div className="relative flex-1">
                                <Input
                                    type="email"
                                    className="bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                // disabled={isLoading || !email}
                                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(96,108,56,0.3)] hover:shadow-[0_0_30px_rgba(96,108,56,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading ? "Submitting..." : "Get Early Access"}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-xl max-w-md mx-auto md:mx-0"
                        >
                            <CheckCircle2 size={24} className="text-primary flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-foreground">Thanks for joining!</p>
                                <p className="text-sm text-muted-foreground">We&apos;ll notify you when we launch.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Social Proof Text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center md:justify-start gap-4 pt-4"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                                    <User size={14} className="text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <strong className="text-foreground">{count !== null ? `${count}+` : '400+'}</strong> people waiting
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT SIDE: Floating UI Mockups (The "Bespoke" Part) */}
                <div className="flex-1 relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] hidden md:block">

                    {/* Floating Card 1: The "Pet Card" Mockup */}
                    <motion.div
                        initial={{ x: 100, opacity: 0, rotate: 6 }}
                        animate={{ x: 0, opacity: 1, rotate: 6 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="absolute top-4 sm:top-6 md:top-10 right-2 sm:right-5 md:right-10 w-60 sm:w-64 md:w-72 lg:w-80 bg-card border border-border p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl z-10 transform hover:rotate-3 transition-transform duration-500"
                    >
                        {/* Fake Image Placeholder */}
                        <div className="h-40 sm:h-44 md:h-48 lg:h-52 bg-secondary rounded-xl sm:rounded-2xl mb-3 sm:mb-4 relative overflow-hidden group cursor-pointer">
                            <Image
                                src="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=300&fit=crop"
                                alt="Golden Retriever"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-foreground font-bold text-sm sm:text-base">
                                Golden Retriever
                            </div>
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-primary/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-primary-foreground font-medium">
                                ₹15,000
                            </div>
                        </div>
                        <div className="flex justify-between items-center cursor-pointer">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <ShieldCheck size={12} className="text-primary sm:w-3.5 sm:h-3.5" />
                                </div>
                                <span className="text-xs sm:text-sm">Verified Seller</span>
                            </div>
                            <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full text-primary">
                                <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Card 2: Tagline Card */}
                    <motion.div
                        initial={{ x: 50, opacity: 0, rotate: -3 }}
                        animate={{ x: 0, opacity: 1, rotate: -3 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="absolute top-[55%] sm:top-[58%] md:top-[60%] left-2 sm:left-5 md:left-10 w-56 sm:w-60 md:w-64 lg:w-72 bg-card/90 backdrop-blur-xl border border-border p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl z-20"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
                            <div className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-primary p-1 flex items-center justify-center shadow-[0_0_10px_rgba(96,108,56,0.3)]">
                                <PawPrint size={16} strokeWidth={3} className="sm:w-5 sm:h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">Your Trusted Tamil Nadu Pet Marketplace.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Card 3: Safety Badge */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="absolute top-0 left-8 sm:left-12 md:left-20 bg-gradient-to-br from-primary to-accent p-1 rounded-xl sm:rounded-2xl shadow-lg rotate-[-12deg]"
                    >
                        <div className="bg-background p-2 sm:p-3 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3">
                            <ShieldCheck className="text-primary w-5 h-5 sm:w-6 sm:h-6" size={20} />
                            <div>
                                <div className="text-[9px] sm:text-xs text-muted-foreground font-bold uppercase">Safety First</div>
                                <div className="text-xs sm:text-sm font-bold text-foreground">100% Verified</div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>

            {/* --- Minimal Footer --- */}
            <footer className="absolute bottom-0 w-full py-6 border-t border-border">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-muted-foreground">
                    <p>© 2025 PetNest Inc.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-foreground cursor-pointer">Privacy</span>
                        <span className="hover:text-foreground cursor-pointer">Terms</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}