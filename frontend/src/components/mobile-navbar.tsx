"use client";

import { Menu, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { useLockBody } from "@/lib/hooks/utils/use-lock-body";
import { cn } from "@/lib/utils";

const CLOSE_DURATION_MS = 220;

function MobileMenu({
  onClose,
  isClosing,
  children,
}: {
  onClose: () => void;
  isClosing: boolean;
  children: ReactNode;
}) {
  useLockBody();
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsOpening(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const isVisible = isOpening && !isClosing;

  return (
    <div
      className={cn(
        "fixed inset-0 top-[50px] z-50 size-full overflow-auto bg-black/40 transition-opacity duration-200 ease-out md:hidden",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "transition-transform duration-200 ease-out",
          isVisible ? "translate-y-0" : "-translate-y-4",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function MobileNavbar({ children }: { children: ReactNode }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openMenu = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsClosing(false);
    setShowMobileMenu(true);
  };

  const closeMenu = () => {
    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setShowMobileMenu(false);
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, CLOSE_DURATION_MS);
  };

  return (
    <>
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => (showMobileMenu ? closeMenu() : openMenu())}
      >
        {showMobileMenu ? <X /> : <Menu />}
      </button>
      {showMobileMenu && (
        <MobileMenu onClose={closeMenu} isClosing={isClosing}>
          {children}
        </MobileMenu>
      )}
    </>
  );
}
