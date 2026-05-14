"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, ClipboardList, LogOut } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bheemasena_user");
    setIsLoggedIn(false);
    setUserName("");
    setIsDropdownOpen(false);
  };

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
        className="fixed top-0 left-0 w-full z-[100] transition-colors duration-300"
        style={{
          backgroundColor: useTransform(bgOpacity, (op) => `rgba(5, 5, 5, ${op})`),
          backdropFilter: useTransform(backdropBlur, (blur) => `blur(${blur}px)`),
          borderBottom: isScrolled ? "1px solid rgba(232,129,10,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Mobile: Hamburger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 text-[#FDF6E3] hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu strokeWidth={2} size={24} />
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center flex-1 md:flex-none">
            <Logo className="h-[36px] w-auto rounded-md shadow-lg" textClass="text-lg text-[#FDF6E3]" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-center">
            {navLinks.filter(l => l.name !== "Home").map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#FDF6E3]/80 hover:text-primary transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA & Login Pill */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            
            <div className="relative" ref={dropdownRef}>
              {isLoggedIn ? (
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 border-[1.5px] border-[rgba(232,129,10,0.50)] text-[#E8810A] rounded-full px-3 py-1.5 sm:px-4 sm:py-1.5 text-[12px] sm:text-[14px] font-semibold bg-transparent hover:bg-[rgba(232,129,10,0.08)] transition-colors"
                >
                  <User size={16} />
                  <span className="max-w-[60px] sm:max-w-[100px] truncate">Hi, {userName}</span>
                </button>
              ) : (
                <Link 
                  href="/login" 
                  className="block border-[1.5px] border-[rgba(232,129,10,0.50)] text-[#E8810A] rounded-full px-3 py-1.5 sm:px-4 sm:py-1.5 text-[12px] sm:text-[14px] font-semibold bg-transparent hover:bg-[rgba(232,129,10,0.08)] transition-colors"
                >
                  Login
                </Link>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && isLoggedIn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-[#141414] border border-[rgba(232,129,10,0.20)] rounded-[12px] p-2 shadow-[0_8px_24px_rgba(232,129,10,0.15)] z-[110]"
                  >
                    <Link href="/order" className="flex items-center gap-3 w-full p-2 text-[14px] font-medium text-[#FDF6E3] hover:bg-[rgba(232,129,10,0.08)] hover:text-primary rounded-lg transition-colors">
                      <ClipboardList size={16} /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2 text-[14px] font-medium text-[#C0392B] hover:bg-red-50 rounded-lg transition-colors text-left mt-1">
                      <LogOut size={16} color="#C0392B" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/#location"
              className="relative group overflow-hidden rounded-full p-[2px] flex-shrink-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(232,129,10,0.5)] group-hover:shadow-[0_0_25px_rgba(232,129,10,0.8)]" />
              <div className="relative px-3 py-1.5 sm:px-5 sm:py-2 bg-[#141414] rounded-full transition-colors duration-300 group-hover:bg-opacity-90">
                <span className="relative z-10 text-[11px] sm:text-sm font-semibold text-[#FDF6E3] group-hover:text-primary transition-colors whitespace-nowrap">
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
            className="fixed inset-0 z-[150] bg-black/55 backdrop-blur-[4px] md:hidden"
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
            className="fixed top-0 left-0 h-full w-[80vw] max-w-[280px] bg-[#050505] border-r-[1px] border-r-[rgba(232,129,10,0.2)] z-[160] shadow-2xl flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-[rgba(232,129,10,0.15)]">
              <Logo className="h-8 w-auto rounded-md" textClass="text-base text-[#FDF6E3]" />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-[#FDF6E3] hover:text-primary transition-colors"
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
                    className="text-[18px] font-semibold text-[#FDF6E3] px-6 py-4 border-b border-[rgba(232,129,10,0.15)] hover:bg-[rgba(232,129,10,0.10)] hover:text-[#E8810A] transition-colors min-h-[52px] flex items-center"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
