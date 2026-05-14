"use client";

import { useState } from "react";

export default function Logo({ className = "h-9 w-auto", textClass = "text-xl" }: { className?: string, textClass?: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className={`font-serif font-bold text-[#E8810A] flex items-center ${textClass}`}>
        Hotel Bheemasena
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src="/bheemasena-logo.jpeg" 
      alt="Hotel Bheemasena" 
      className={`${className} object-contain block`}
      onError={() => setError(true)}
    />
  );
}
