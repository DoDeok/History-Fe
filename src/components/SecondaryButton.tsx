"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false,
  className = ""
}: SecondaryButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 bg-[#EFE9E3] text-[#2D2A26] rounded-lg hover:bg-[#DAD0C7] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
}
