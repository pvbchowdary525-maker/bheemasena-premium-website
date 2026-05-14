"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, CreditCard, CheckCircle, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  
  const [paymentMode, setPaymentMode] = useState<"COD" | "ONLINE">("COD");
  const [showToast, setShowToast] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setIsClient(true);
    const user = localStorage.getItem("bheemasena_user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.name || "");
      // Mocking a phone number for logged in user if missing
      setUserPhone(parsed.phone || "+91 98765 43210");
    }
  }, []);

  const handleOnlineClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      setOrderId("BHM-" + Math.floor(1000 + Math.random() * 9000));
      setOrderPlaced(true);
    }
  };

  if (!isClient) return null;

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="mb-8 flex flex-col items-center"
        >
          <Logo className="h-[40px] w-auto mb-6" />
          <CheckCircle size={72} color="#E8810A" strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-4 flex items-center justify-center gap-3">
          Order Placed! <PartyPopper size={28} color="#E8810A" />
        </h1>
        
        <p className="text-[16px] text-foreground font-medium mb-6 max-w-md">
          Your order has been received. We&apos;ll have it ready shortly!
        </p>
        
        <div className="bg-[rgba(232,129,10,0.06)] border border-[rgba(232,129,10,0.20)] rounded-xl p-4 mb-8 w-full max-w-sm">
          <p className="text-sm text-muted mb-1">Order ID</p>
          <p className="font-bold text-lg text-foreground">Order #{orderId}</p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Link href="/" className="w-full">
            <button className="w-full h-[52px] rounded-xl border-2 border-[#E8810A] text-[#E8810A] font-bold text-[16px] hover:bg-[#E8810A]/10 transition-colors">
              Back to Home
            </button>
          </Link>
          <Link href="/order" className="w-full">
            <button className="w-full h-[52px] rounded-xl bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[16px] shadow-lg hover:opacity-90 transition-opacity">
              View Menu Again
            </button>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans pb-[40px]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(232,129,10,0.15)] sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/order" className="flex items-center">
            <ArrowLeft size={24} className="text-foreground mr-4" />
            <h1 className="font-serif font-bold text-xl text-gradient-dark">Checkout</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          
          {/* Section 1 - Delivery Details */}
          <section className="bg-white rounded-[16px] p-5 border border-[rgba(232,129,10,0.15)] shadow-sm">
            <h2 className="font-semibold text-[18px] text-foreground mb-4">Delivery Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[13px] text-muted font-medium mb-1">Name</label>
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[rgba(232,129,10,0.04)] border border-[rgba(232,129,10,0.20)] rounded-lg p-3 text-[15px] focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[13px] text-muted font-medium mb-1">Phone</label>
                <input 
                  type="tel" 
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-[rgba(232,129,10,0.04)] border border-[rgba(232,129,10,0.20)] rounded-lg p-3 text-[15px] focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-[13px] text-muted font-medium mb-1">Delivery address / Room / Hostel block</label>
              <textarea 
                placeholder="e.g., VIT-AP Boys Hostel, Room 204, Block C"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[rgba(232,129,10,0.04)] border border-[rgba(232,129,10,0.20)] rounded-lg p-3 text-[15px] min-h-[80px] resize-none focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-[13px] text-muted font-medium mb-1">Any special instructions? (e.g., no onion)</label>
              <input 
                type="text" 
                placeholder="Optional instructions..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full bg-[rgba(232,129,10,0.04)] border border-[rgba(232,129,10,0.20)] rounded-lg p-3 text-[15px] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </section>

          {/* Section 2 - Order Summary */}
          <section className="bg-white rounded-[16px] p-5 border border-[rgba(232,129,10,0.15)] shadow-sm">
            <h2 className="font-semibold text-[18px] text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-[14px]">
                <span>2 x Chicken Dum Biryani</span>
                <span>₹360</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span>1 x Masala Dosa</span>
                <span>₹60</span>
              </div>
            </div>
            <div className="border-t border-[rgba(232,129,10,0.15)] pt-3 flex justify-between font-bold text-[16px]">
              <span>To Pay</span>
              <span>₹420</span>
            </div>
          </section>

          {/* Section 3 - Payment Mode */}
          <section className="space-y-4">
            <h2 className="font-semibold text-[18px] text-foreground">Choose Payment Method</h2>
            
            {/* Card A - COD */}
            <div 
              onClick={() => setPaymentMode("COD")}
              className={`p-4 rounded-[14px] cursor-pointer transition-all flex items-center gap-4 ${
                paymentMode === "COD" 
                  ? "border-2 border-[#E8810A] bg-[rgba(232,129,10,0.08)]" 
                  : "border border-[rgba(232,129,10,0.20)] bg-white hover:bg-[rgba(232,129,10,0.02)]"
              }`}
            >
              <div className="flex-shrink-0">
                <Banknote size={28} color="#E8810A" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] text-foreground">Cash on Delivery</h3>
                <p className="text-[13px] text-muted">Pay when your order arrives</p>
              </div>
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#E8810A] flex items-center justify-center">
                {paymentMode === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-[#E8810A]" />}
              </div>
            </div>

            {/* Card B - Online (Disabled) */}
            <div 
              onClick={handleOnlineClick}
              className="p-4 rounded-[14px] border border-[rgba(232,129,10,0.20)] bg-white opacity-45 cursor-not-allowed flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                <CreditCard size={28} color="rgba(26,10,0,0.35)" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-[16px] text-foreground">Pay Online</h3>
                  <span className="bg-[rgba(232,129,10,0.20)] text-[#E8810A] text-[11px] font-bold rounded-full px-2 py-0.5">
                    Coming Soon
                  </span>
                </div>
                <p className="text-[13px] text-muted">UPI, Cards, Wallets — available soon</p>
              </div>
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />
            </div>
            
            {showToast && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#C0392B] text-[13px] font-medium text-center"
              >
                Online payment coming soon! Please use COD for now.
              </motion.div>
            )}
          </section>

          <button 
            type="submit"
            className="w-full h-[56px] rounded-[14px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[17px] shadow-lg mt-6 hover:opacity-90 transition-opacity"
          >
            Place Order — ₹420
          </button>
        </form>
      </main>
    </div>
  );
}
