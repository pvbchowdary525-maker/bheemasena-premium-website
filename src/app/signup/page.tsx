"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";


export default function SignupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden font-sans">
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(232,129,10,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 w-[90vw] max-w-[400px] bg-[rgba(232,129,10,0.06)] border border-[rgba(232,129,10,0.20)] rounded-[20px] p-[40px_32px] text-center">
          <div className="flex justify-center mb-6">
            <Mail size={56} color="#E8810A" strokeWidth={1.5} />
          </div>
          <h1 className="text-[26px] font-bold text-foreground mb-3 font-serif">
            Verify your email
          </h1>
          <p className="text-[14px] text-muted mb-8 leading-relaxed">
            We&apos;ve sent a verification link to <span className="font-semibold text-primary">{email || "your email"}</span>. Please check your inbox and click the link to activate your account.
          </p>
          
          <button className="w-full h-[48px] rounded-[10px] border border-[rgba(232,129,10,0.40)] text-[#E8810A] font-semibold text-[15px] hover:bg-[rgba(232,129,10,0.05)] transition-colors mb-6">
            Resend Email
          </button>
          
          <Link href="/login" className="inline-flex items-center gap-2 text-[14px] text-primary hover:underline font-medium">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden font-sans py-10">
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(232,129,10,0.08) 0%, transparent 70%)" }}
      />
      
      <div className="relative z-10 w-[90vw] max-w-[400px] bg-[rgba(232,129,10,0.06)] border border-[rgba(232,129,10,0.20)] rounded-[20px] p-[40px_32px]">
        <div className="flex justify-center mb-[24px]">
          <span className="font-serif font-bold text-[#E8810A] text-4xl">Hotel Bheemasena</span>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-[26px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary mb-1 font-serif">
            Create Account
          </h1>
          <p className="text-[14px] text-muted">
            Join the Bheemasena family
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 98765 43210"
              className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input type="checkbox" id="terms" className="mt-1" required />
            <label htmlFor="terms" className="text-xs text-muted">
              I agree to the Terms & Conditions
            </label>
          </div>

          <button 
            type="submit"
            className="w-full h-[48px] rounded-[10px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-semibold text-[15px] shadow-md hover:opacity-90 transition-opacity mt-2"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-[14px] text-muted hover:text-primary transition-colors">
            Already have an account? <span className="font-semibold text-primary underline-offset-4 hover:underline">Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
