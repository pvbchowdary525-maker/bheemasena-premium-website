"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Square, ShoppingCart, Trash2, X, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
};

const MENU_DATA: MenuItem[] = [
  // Veg Starters
  { id: "vst-1", name: "Veg Manchuria", description: "Vegetable dumplings tossed in a savory Indo-Chinese sauce.", price: 210, category: "Veg Starters", isVeg: true },
  { id: "vst-2", name: "Chilli Mushroom", description: "Crispy mushrooms tossed in spicy chilli sauce.", price: 230, category: "Veg Starters", isVeg: true },
  { id: "vst-3", name: "Crispy Baby Corn", description: "Fried baby corn with a crunchy, spiced coating.", price: 230, category: "Veg Starters", isVeg: true },
  { id: "vst-4", name: "Paneer 65", description: "Spicy, deep-fried paneer cubes tossed in curry leaves.", price: 280, category: "Veg Starters", isVeg: true },
  { id: "vst-5", name: "Paneer Majestic", description: "Delicious paneer strips cooked in a creamy, tangy yogurt sauce.", price: 290, category: "Veg Starters", isVeg: true },
  
  // Non-Veg Starters
  { id: "nvst-1", name: "Chilli Chicken", description: "Spicy battered chicken chunks tossed with bell peppers and onions.", price: 290, category: "Non-Veg Starters", isVeg: false },
  { id: "nvst-2", name: "Chicken Manchuria", description: "Fried chicken tossed in sweet, spicy, and tangy Manchurian sauce.", price: 290, category: "Non-Veg Starters", isVeg: false },
  { id: "nvst-3", name: "Chicken 65", description: "Classic fiery red, deep-fried chicken bites.", price: 290, category: "Non-Veg Starters", isVeg: false },
  { id: "nvst-4", name: "Chicken Majestic", description: "Chicken strips marinated, fried, and sautéed in a rich yogurt sauce.", price: 290, category: "Non-Veg Starters", isVeg: false },

  // Veg Biryani (Sufficient for 2 people)
  { id: "vbir-1", name: "Special Paneer Biryani", description: "Aromatic basmati rice cooked with rich paneer and secret spices. (Serves 2)", price: 290, category: "Veg Biryani", isVeg: true },
  { id: "vbir-2", name: "Special Mushroom Biryani", description: "Flavor-packed biryani layered with spiced mushrooms. (Serves 2)", price: 290, category: "Veg Biryani", isVeg: true },
  { id: "vbir-3", name: "Special Veg Biryani", description: "Classic vegetable biryani cooked to perfection. (Serves 2)", price: 260, category: "Veg Biryani", isVeg: true },
  { id: "vbir-4", name: "Ulavacharu Biryani", description: "Authentic Andhra-style biryani flavored with horse gram soup. (Serves 2)", price: 270, category: "Veg Biryani", isVeg: true },
  { id: "vbir-5", name: "Kaju Biryani", description: "Rich and luxurious biryani loaded with roasted cashews. (Serves 2)", price: 290, category: "Veg Biryani", isVeg: true },
  { id: "vbir-6", name: "Special Kaju Biryani", description: "Extra special rich biryani loaded with premium cashews. (Serves 2)", price: 310, category: "Veg Biryani", isVeg: true },
  { id: "vbir-7", name: "Biryani Rice", description: "Plain aromatic biryani flavored rice. (Serves 2)", price: 180, category: "Veg Biryani", isVeg: true },
  { id: "vbir-8", name: "Veg Biryani", description: "Standard fragrant vegetable biryani. (Serves 2)", price: 240, category: "Veg Biryani", isVeg: true },

  // Non-Veg Biryani (Sufficient for 2 people)
  { id: "nvbir-1", name: "Special Egg Biryani", description: "Flavorful biryani with perfectly boiled and spiced eggs. (Serves 2)", price: 280, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-2", name: "Chicken Dum Biryani", description: "Aromatic basmati rice cooked with tender chicken and secret spices. (Serves 2)", price: 270, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-3", name: "Kundan Biryani", description: "Chef's special premium chicken biryani. (Serves 2)", price: 360, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-4", name: "Chicken Fry Biryani", description: "Biryani rice served with spicy fried chicken pieces. (Serves 2)", price: 280, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-5", name: "Special Chicken Biryani", description: "Extra rich chicken biryani with special spices and boneless pieces. (Serves 2)", price: 300, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-6", name: "Joint Biryani", description: "Biryani served with full chicken leg joints. (Serves 2)", price: 310, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-7", name: "Chicken Mughlai Biryani", description: "Rich and creamy Mughlai-style chicken biryani. (Serves 2)", price: 310, category: "Non-Veg Biryani", isVeg: false },
  { id: "nvbir-8", name: "Chicken Lollipop Biryani", description: "Spicy biryani served with crispy chicken lollipops. (Serves 2)", price: 330, category: "Non-Veg Biryani", isVeg: false },

  // Mini Biryani (Sufficient for 1 person)
  { id: "mbir-1", name: "Mini Dum Biryani", description: "Single portion of our classic Chicken Dum Biryani.", price: 170, category: "Mini Biryani", isVeg: false },
  { id: "mbir-2", name: "Mini Fry Biryani", description: "Single portion of Chicken Fry Biryani.", price: 180, category: "Mini Biryani", isVeg: false },
  { id: "mbir-3", name: "Mini Special Chicken Biryani", description: "Single portion of our Special Chicken Biryani.", price: 190, category: "Mini Biryani", isVeg: false },
  { id: "mbir-4", name: "Mini Paneer Biryani", description: "Single portion of our Special Paneer Biryani.", price: 190, category: "Mini Biryani", isVeg: true },
  { id: "mbir-5", name: "Mini Mushroom Biryani", description: "Single portion of Special Mushroom Biryani.", price: 200, category: "Mini Biryani", isVeg: true },
  { id: "mbir-6", name: "Mini Mughlai Biryani", description: "Single portion of rich Chicken Mughlai Biryani.", price: 200, category: "Mini Biryani", isVeg: false },
  { id: "mbir-7", name: "Mini Boneless Biryani", description: "Single portion of boneless chicken biryani.", price: 190, category: "Mini Biryani", isVeg: false },
  { id: "mbir-8", name: "Mini Special Biryani", description: "Single portion of our premium special biryani.", price: 200, category: "Mini Biryani", isVeg: false },

  // Breads
  { id: "brd-1", name: "Butter Naan", description: "Soft Indian flatbread cooked in tandoor and brushed with butter.", price: 45, category: "Breads", isVeg: true },
  { id: "brd-2", name: "Roti", description: "Whole wheat flatbread cooked in tandoor.", price: 25, category: "Breads", isVeg: true },

  // Veg Curries
  { id: "vcur-1", name: "Paneer Butter Masala", description: "Cottage cheese cubes in a rich tomato and butter gravy.", price: 280, category: "Veg Curries", isVeg: true },
  { id: "vcur-2", name: "Kaju Paneer Butter Masala", description: "Premium curry with cashews and paneer in a buttery gravy.", price: 300, category: "Veg Curries", isVeg: true },

  // Non-Veg Curries
  { id: "nvcur-1", name: "Egg Burji", description: "Spicy Indian scrambled eggs with onions and tomatoes.", price: 190, category: "Non-Veg Curries", isVeg: false },
  { id: "nvcur-2", name: "Butter Chicken", description: "Tender chicken cooked in a rich, creamy, tomato-based gravy.", price: 290, category: "Non-Veg Curries", isVeg: false },
  { id: "nvcur-3", name: "Chicken Curry", description: "Classic homestyle spicy chicken curry.", price: 270, category: "Non-Veg Curries", isVeg: false },
];

const CATEGORIES = ["All", "Veg Starters", "Non-Veg Starters", "Veg Biryani", "Non-Veg Biryani", "Mini Biryani", "Breads", "Veg Curries", "Non-Veg Curries"];

export default function OrderPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const user = localStorage.getItem("bheemasena_user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const filteredMenu = useMemo(() => {
    return MENU_DATA.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const updateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAddClick = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginSheet(true);
      return;
    }
    updateCart(id, 1);
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = MENU_DATA.find((i) => i.id === id);
    return total + (item ? item.price * qty : 0);
  }, 0);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans pb-[100px] md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(232,129,10,0.15)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ArrowLeft size={24} className="text-foreground mr-4" />
            <h1 className="font-serif font-bold text-xl text-gradient-dark">Menu</h1>
          </Link>
          <Logo className="h-8 w-auto" />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto px-4 py-3 gap-2 bg-[#FFF8ED] hide-scrollbar whitespace-nowrap border-b border-[rgba(232,129,10,0.1)]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-[18px] py-[8px] rounded-full text-[14px] font-semibold transition-colors flex-shrink-0 ${
                activeCategory === cat 
                  ? "bg-[#E8810A] text-white" 
                  : "border border-[rgba(232,129,10,0.30)] text-[rgba(26,10,0,0.65)] hover:border-primary/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 max-w-7xl mx-auto w-full">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A0A00] opacity-50" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[rgba(232,129,10,0.04)] border border-[rgba(232,129,10,0.20)] rounded-xl py-[10px] pl-10 pr-4 text-[15px] text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Menu List */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:flex md:gap-8">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {filteredMenu.map((item) => (
              <div key={item.id} className="bg-[rgba(232,129,10,0.06)] border border-[rgba(232,129,10,0.12)] rounded-[14px] p-4 flex justify-between items-center transition-all hover:bg-[rgba(232,129,10,0.08)]">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Square size={14} className={item.isVeg ? "fill-[#22C55E] text-[#22C55E]" : "fill-[#EF4444] text-[#EF4444]"} />
                    <h3 className="text-[#1A0A00] font-semibold text-[15px]">{item.name}</h3>
                  </div>
                  <p className="text-[rgba(26,10,0,0.55)] text-[13px] leading-snug line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[#E8810A] font-bold text-[16px] mt-2">
                    ₹{item.price}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {!cart[item.id] ? (
                    <button 
                      onClick={() => handleAddClick(item.id)}
                      className="border-[1.5px] border-[#E8810A] text-[#E8810A] rounded-lg px-[20px] py-[6px] font-bold text-[14px] hover:bg-[#E8810A] hover:text-white transition-colors"
                    >
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center border-[1.5px] border-[#E8810A] rounded-lg bg-white overflow-hidden shadow-sm">
                      <button onClick={() => updateCart(item.id, -1)} className="px-3 py-1 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 text-lg leading-none">−</button>
                      <span className="px-2 text-[#E8810A] font-bold text-[14px] min-w-[20px] text-center">{cart[item.id]}</span>
                      <button onClick={() => updateCart(item.id, 1)} className="px-3 py-1 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 text-lg leading-none">+</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredMenu.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted">
                No items found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Desktop Cart Sidebar */}
        <div className="hidden md:block w-[400px] flex-shrink-0">
          <div className="sticky top-[160px] bg-[#FDF6E3] border-t-[2px] border-[rgba(232,129,10,0.30)] rounded-t-[20px] shadow-xl p-6 h-[calc(100vh-180px)] flex flex-col">
            <h2 className="font-serif text-[24px] font-bold text-[#E8810A] mb-6 flex justify-between items-center">
              Your Cart 
              <span className="bg-[#E8810A] text-white text-[14px] font-sans px-3 py-1 rounded-full">{cartTotalItems}</span>
            </h2>
            
            {cartTotalItems === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted">
                <ShoppingCart size={48} className="mb-4 opacity-20" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = MENU_DATA.find((i) => i.id === id)!;
                    return (
                      <div key={id} className="flex justify-between items-center py-4 border-b border-[rgba(232,129,10,0.10)]">
                        <div className="flex-1 pr-4">
                          <p className="font-semibold text-[15px]">{item.name}</p>
                          <p className="text-[13px] text-muted">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-[1.5px] border-[#E8810A] rounded-lg bg-white overflow-hidden shadow-sm">
                            <button onClick={() => updateCart(id, -1)} className="px-2 py-0.5 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 leading-none">−</button>
                            <span className="px-2 text-[#E8810A] font-bold text-[13px]">{qty}</span>
                            <button onClick={() => updateCart(id, 1)} className="px-2 py-0.5 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 leading-none">+</button>
                          </div>
                          <button onClick={() => updateCart(id, -qty)} className="text-[#C0392B] hover:opacity-80">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4">
                  <div className="bg-[rgba(232,129,10,0.08)] rounded-[12px] p-4 mb-4">
                    <div className="flex justify-between text-[14px] mb-2">
                      <span className="text-muted">Item total</span>
                      <span className="font-semibold">₹{cartTotalPrice}</span>
                    </div>
                    <div className="flex justify-between text-[14px] mb-3">
                      <span className="text-muted">Delivery charge</span>
                      <span className="text-primary font-medium">Free for now</span>
                    </div>
                    <div className="flex justify-between text-[18px] font-bold border-t border-[rgba(232,129,10,0.15)] pt-3">
                      <span>Total</span>
                      <span>₹{cartTotalPrice}</span>
                    </div>
                  </div>
                  
                  <Link href="/checkout" className="block w-full">
                    <button className="w-full h-[52px] rounded-[12px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[16px] shadow-lg hover:opacity-90 transition-opacity">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Floating Cart Button */}
      <AnimatePresence>
        {cartTotalItems > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-[400px]"
          >
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white rounded-[14px] p-[14px_28px] font-bold text-[15px] shadow-[0_8px_32px_rgba(232,129,10,0.45)] flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[13px]">{cartTotalItems} items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>View Cart</span>
                <span>→</span>
                <span>₹{cartTotalPrice}</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Cart Bottom Sheet */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed bottom-0 left-0 w-full h-[90vh] bg-[#FDF6E3] z-[70] border-t-[2px] border-[rgba(232,129,10,0.30)] rounded-t-[20px] flex flex-col shadow-2xl"
            >
              <div className="w-full flex justify-center py-3">
                <div className="w-12 h-1.5 bg-[rgba(232,129,10,0.2)] rounded-full"></div>
              </div>
              
              <div className="px-6 flex justify-between items-center mb-4">
                <h2 className="font-serif text-[24px] font-bold text-[#E8810A]">
                  Your Cart <span className="bg-[#E8810A] text-white text-[14px] font-sans px-3 py-1 rounded-full ml-2">{cartTotalItems}</span>
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-foreground p-1">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {Object.entries(cart).map(([id, qty]) => {
                  const item = MENU_DATA.find((i) => i.id === id)!;
                  return (
                    <div key={id} className="flex justify-between items-center py-4 border-b border-[rgba(232,129,10,0.10)]">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-[15px] text-foreground">{item.name}</p>
                        <p className="text-[13px] text-muted line-clamp-1">{item.description}</p>
                        <p className="text-[14px] font-medium text-[#E8810A] mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <button onClick={() => updateCart(id, -qty)} className="text-[#C0392B] hover:opacity-80 p-1">
                          <Trash2 size={18} />
                        </button>
                        <div className="flex items-center border-[1.5px] border-[#E8810A] rounded-lg bg-white overflow-hidden shadow-sm">
                          <button onClick={() => updateCart(id, -1)} className="px-3 py-1 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 leading-none text-lg">−</button>
                          <span className="px-2 text-[#E8810A] font-bold text-[14px]">{qty}</span>
                          <button onClick={() => updateCart(id, 1)} className="px-3 py-1 text-[#E8810A] font-bold hover:bg-[#E8810A]/10 leading-none text-lg">+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-6 bg-white border-t border-[rgba(232,129,10,0.15)]">
                <div className="bg-[rgba(232,129,10,0.08)] rounded-[12px] p-4 mb-4">
                  <div className="flex justify-between text-[14px] mb-2">
                    <span className="text-muted">Item total</span>
                    <span className="font-semibold">₹{cartTotalPrice}</span>
                  </div>
                  <div className="flex justify-between text-[14px] mb-3">
                    <span className="text-muted">Delivery charge</span>
                    <span className="text-primary font-medium">Free for now</span>
                  </div>
                  <div className="flex justify-between text-[18px] font-bold border-t border-[rgba(232,129,10,0.15)] pt-3">
                    <span>Total</span>
                    <span>₹{cartTotalPrice}</span>
                  </div>
                </div>
                
                <Link href="/checkout" className="block w-full">
                  <button className="w-full h-[52px] rounded-[12px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[16px] shadow-lg">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Login Bottom Sheet */}
      <AnimatePresence>
        {showLoginSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginSheet(false)}
              className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-[#FFFAF0] z-[210] border-t-[2px] border-[rgba(232,129,10,0.30)] rounded-t-[20px] p-[28px_24px] shadow-2xl"
              style={{ maxHeight: '60vh' }}
            >
              <div className="w-[40px] h-[4px] bg-[rgba(26,10,0,0.15)] rounded-full mx-auto mb-5"></div>
              
              <div className="flex justify-center mb-4">
                <Logo className="h-[48px] w-auto" />
              </div>
              
              <h2 className="text-[20px] font-bold text-[#1A0A00] text-center mb-2">
                Login to add items
              </h2>
              <p className="text-[rgba(26,10,0,0.55)] text-[14px] text-center mb-6">
                Create a free account or login to start ordering from Bheemasena.
              </p>
              
              <Link href="/login?returnTo=/order" className="block w-full">
                <button className="w-full h-[50px] rounded-[12px] bg-gradient-to-r from-[#E8810A] to-[#C0392B] text-white font-bold text-[16px] shadow-lg mb-4">
                  Login / Create Account
                </button>
              </Link>
              
              <button 
                onClick={() => setShowLoginSheet(false)}
                className="w-full text-[#E8810A] text-[14px] font-medium text-center hover:opacity-80 transition-opacity"
              >
                Continue browsing
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
