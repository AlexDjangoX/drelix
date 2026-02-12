"use client";

import { Menu, X } from "lucide-react";

type NavbarMenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export function NavbarMenuButton({ isOpen, onClick }: NavbarMenuButtonProps) {
  return (
    <button
      className="lg:hidden cursor-pointer p-1.5 sm:p-2 shrink-0"
      onClick={onClick}
      aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
    >
      {isOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
    </button>
  );
}
