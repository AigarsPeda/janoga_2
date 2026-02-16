"use client";

import { Menu, X } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { useLockBody } from "@/lib/hooks/utils/use-lock-body";

const CLOSE_DURATION_MS = 350;

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
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const backdrop = backdropRef.current;
    const content = contentRef.current;

    if (!backdrop || !content) return;

    // Get all nav links and buttons for stagger animation
    const navItems = content.querySelectorAll("a, button");

    if (isClosing) {
      // Closing animation
      const tl = gsap.timeline();

      // Animate items out with stagger
      if (navItems.length) {
        tl.to(navItems, {
          opacity: 0,
          y: -15,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.in",
        }, 0);
      }

      // Slide content up
      tl.to(content, {
        y: -30,
        duration: 0.3,
        ease: "power2.in",
      }, 0.05);

      // Fade backdrop
      tl.to(backdrop, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
      }, 0);

    } else {
      // Opening animation
      gsap.set(content, { y: -20, opacity: 0 });
      gsap.set(navItems, { opacity: 0, y: -10 });
      gsap.set(backdrop, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Fade in backdrop with blur
      tl.to(backdrop, {
        opacity: 1,
        duration: 0.3,
      }, 0);

      // Slide in content with spring-like effect
      tl.to(content, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(1.2)",
      }, 0.1);

      // Stagger nav items
      if (navItems.length) {
        tl.to(navItems, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        }, 0.25);
      }
    }
  }, [isClosing]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 top-[50px] z-50 size-full overflow-auto backdrop-blur-sm bg-black/40 md:hidden"
      onClick={onClose}
    >
      <div
        ref={contentRef}
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !iconRef.current) return;

    // Animate icon transition
    gsap.to(iconRef.current, {
      rotation: showMobileMenu ? 90 : 0,
      scale: showMobileMenu ? 1.1 : 1,
      duration: 0.3,
      ease: "back.out(2)",
    });
  }, [showMobileMenu]);

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
        ref={buttonRef}
        className="flex items-center space-x-2 md:hidden relative z-[60] p-2 -m-2 transition-colors hover:text-primary"
        onClick={() => (showMobileMenu ? closeMenu() : openMenu())}
        aria-label={showMobileMenu ? "Close menu" : "Open menu"}
      >
        <div ref={iconRef} className="will-change-transform">
          {showMobileMenu ? <X /> : <Menu />}
        </div>
      </button>
      {showMobileMenu && (
        <MobileMenu onClose={closeMenu} isClosing={isClosing}>
          {children}
        </MobileMenu>
      )}
    </>
  );
}
