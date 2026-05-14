"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("bheemasena_user", JSON.stringify({ name: email.split("@")[0], email }));
      
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/order";
      router.push(returnTo);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden font-sans">
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
            Welcome Back
          </h1>
          <p className="text-[14px] text-muted">
            Login to your Bheemasena account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[rgba(232,129,10,0.08)] border border-[rgba(232,129,10,0.25)] rounded-[10px] p-[12px_16px] text-[#2C1A00] text-[15px] box-border focus:border-primary focus:shadow-[0_0_0_3px_rgba(232,129,10,0.15)] focus:outline-none transition-all duration-200 pr-12"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary/80 hover:text-primary transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <Link href="#" className="text-[#E8810A] text-[13px] hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-[48px] rounded-[10px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-semibold text-[15px] shadow-md hover:opacity-90 transition-opacity mt-2"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[rgba(232,129,10,0.15)]"></div>
          <span className="px-3 text-xs text-muted font-medium">— OR —</span>
          <div className="flex-1 border-t border-[rgba(232,129,10,0.15)]"></div>
        </div>

        <Link href="/signup" className="block w-full">
          <button className="w-full h-[48px] rounded-[10px] border border-[rgba(232,129,10,0.40)] text-[#E8810A] font-semibold text-[15px] hover:bg-[rgba(232,129,10,0.05)] transition-colors">
            Create Account
          </button>
        </Link>
      </div>
    </main>
  );
}
