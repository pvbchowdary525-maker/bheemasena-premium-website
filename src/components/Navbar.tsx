"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Use framer-motion to transition background and blur
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
  const backdropBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    const user = localStorage.getItem("bheemasena_user");
    if (user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name || "User");
    }
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/order" },
    { name: "Our Story", href: "/#story" },
    { name: "Specials", href: "/#specials" },
    { name: "Find Us", href: "/#location" },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 transition-colors duration-300"
        style={{
          backgroundColor: useTransform(bgOpacity, (op) => `rgba(255, 250, 240, ${op})`),
          backdropFilter: useTransform(backdropBlur, (blur) => `blur(${blur}px)`),
          borderBottom: isScrolled ? "1px solid rgba(232,129,10,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Mobile: Hamburger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu strokeWidth={2} size={24} />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center flex-1 md:flex-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/bheemasena-logo.jpeg" 
              alt="Hotel Bheemasena" 
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.filter(l => l.name !== "Home").map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA & Desktop Login */}
          <div className="flex items-center justify-end gap-4">
            <div className="hidden md:block">
              {isLoggedIn ? (
                <Link href="/order" className="text-sm font-medium text-primary hover:text-secondary transition-colors">
                  Hi, {userName}
                </Link>
              ) : (
                <Link href="/login" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Login
                </Link>
              )}
            </div>
            <Link
              href="/#location"
              className="relative group overflow-hidden rounded-full p-[2px] flex-shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(232,129,10,0.5)] group-hover:shadow-[0_0_25px_rgba(232,129,10,0.8)]" />
              <div className="relative px-4 py-2 sm:px-5 sm:py-2 bg-cream rounded-full transition-colors duration-300 group-hover:bg-opacity-90">
                <span className="relative z-10 text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Visit Us Today
                </span>
              </div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[4px] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-full w-[80vw] max-w-[280px] bg-[#FDF6E3] border-l-[3px] border-l-[#E8810A] z-[70] shadow-2xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[rgba(232,129,10,0.15)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bheemasena-logo.jpeg" alt="Logo" className="h-8 w-auto object-contain" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-foreground hover:text-primary transition-colors"
              >
                <X strokeWidth={2} size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[18px] font-semibold text-[#1A0A00] px-6 py-4 border-b border-[rgba(232,129,10,0.15)] hover:bg-[rgba(232,129,10,0.10)] hover:text-[#E8810A] transition-colors min-h-[52px] flex items-center"
                  >
                    {link.name}
                  </Link>
                ))}
                
                {isLoggedIn ? (
                  <Link
                    href="/order"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[18px] font-semibold text-primary px-6 py-4 hover:bg-[rgba(232,129,10,0.10)] transition-colors min-h-[52px] flex items-center"
                  >
                    My Account ({userName})
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[18px] font-semibold text-[#1A0A00] px-6 py-4 hover:bg-[rgba(232,129,10,0.10)] hover:text-[#E8810A] transition-colors min-h-[52px] flex items-center"
                  >
                    Login / My Account
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
