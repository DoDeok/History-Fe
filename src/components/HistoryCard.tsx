"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HistoryCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function HistoryCard({ children, className = "", onClick }: HistoryCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`bg-[#F9F8F6] rounded-xl shadow-sm p-6 border border-[#EFE9E3] transition-all ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${className}`}
      whileHover={onClick ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
