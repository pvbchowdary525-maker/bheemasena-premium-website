"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Use framer-motion to transition background and blur
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
  const backdropBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = [
    { name: "Menu", href: "#menu" },
    { name: "Our Story", href: "#story" },
    { name: "Specials", href: "#specials" },
    { name: "Find Us", href: "#location" },
    { name: "Order Now", href: "#order" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 transition-colors duration-300"
      style={{
        backgroundColor: useTransform(bgOpacity, (op) => `rgba(26, 10, 0, ${op})`),
        backdropFilter: useTransform(backdropBlur, (blur) => `blur(${blur}px)`),
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className={`font-serif text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-foreground'}`}>
          Hotel Bheemasena
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                isScrolled ? "text-white/80 hover:text-white" : "text-foreground/80 hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="#visit"
          className="relative group overflow-hidden rounded-full p-[2px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(232,129,10,0.5)] group-hover:shadow-[0_0_25px_rgba(232,129,10,0.8)]" />
          <div className="relative px-5 py-2 bg-background rounded-full transition-colors duration-300 group-hover:bg-opacity-90">
            <span className="relative z-10 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Visit Us Today
            </span>
          </div>
        </Link>
      </div>
    </motion.nav>
  );
}
