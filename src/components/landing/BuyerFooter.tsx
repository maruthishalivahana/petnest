'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export default function BuyerFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border mt-12">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
                            </div>
                            <h3 className="text-xl font-bold">PetNest</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Tamil Nadu&apos;s most trusted pet marketplace. Connect directly with verified breeders and pet owners. Safe, secure, and transparent transactions.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="https://facebook.com"
                                target="_blank"
                                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://twitter.com"
                                target="_blank"
                                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://instagram.com"
                                target="_blank"
                                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://linkedin.com"
                                target="_blank"
                                className="w-9 h-9 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/home" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Browse Pets
                                </Link>
                            </li>
                            <li>
                                <Link href="/feed" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Pet Feed
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    My Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link href="/seller/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Become a Seller
                                </Link>
                            </li>
                            <li>
                                <Link href="/request-ad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Advertise With Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Pet Categories */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Popular Categories</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/home?species=dog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Dogs
                                </Link>
                            </li>
                            <li>
                                <Link href="/home?species=cat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Cats
                                </Link>
                            </li>
                            <li>
                                <Link href="/home?species=bird" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Birds
                                </Link>
                            </li>
                            <li>
                                <Link href="/home?species=rabbit" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Rabbits
                                </Link>
                            </li>
                            <li>
                                <Link href="/home?species=fish" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Fish
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Contact & Support</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <a href="mailto:support@petnest.com" className="text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                                    support@petnest.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <a href="tel:+919876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                    Chennai, Tamil Nadu, India
                                </span>
                            </li>
                        </ul>
                        <div className="pt-4 space-y-2">
                            <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                                Help Center
                            </Link>
                            <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                                FAQs
                            </Link>
                            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground text-center md:text-left">
                        © {currentYear} PetNest. All rights reserved. Made with <Heart className="w-3 h-3 inline text-red-500" fill="currentColor" /> for pets.
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Cookie Policy
                        </Link>
                        <Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Refund Policy
                        </Link>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>100% Safe Transactions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span>Verified Sellers</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span>Trusted by 10,000+ Users</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
