"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/ask", label: "Ask" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-navy)]/96 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/davids-temple-logo-white.png"
            alt="David's Temple Missionary Baptist Church"
            width={3600}
            height={3600}
            priority
            className="h-12 w-28 object-contain sm:h-14 sm:w-32"
          />
          <span className="hidden text-base font-semibold tracking-wide text-white sm:inline">
            David&apos;s Temple App
          </span>
        </Link>
        <Button
          type="button"
          variant="light"
          size="sm"
          className="h-10 w-10 px-0"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {isOpen ? (
        <nav className="border-t border-white/10 bg-[var(--brand-navy)] px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
