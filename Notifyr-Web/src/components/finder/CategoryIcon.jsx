import React from "react";
import {
  Briefcase,
  Laptop,
  Key,
  Smartphone,
  Wallet,
  GlassWater,
  Package,
} from "lucide-react";

const categoryIcons = {
  bag: Briefcase,
  laptop: Laptop,
  keys: Key,
  mobile: Smartphone,
  wallet: Wallet,
  bottle: GlassWater,
};

export default function CategoryIcon({
  category,
  className = "w-6 h-6 text-[#F5C400]",
}) {
  const Icon = categoryIcons[category] || Package;
  return <Icon className={className} />;
}
