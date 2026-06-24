"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const navLinks = [
  { href: "/ask", label: "Ask" },
  { href: "/bulletin", label: "Bulletin" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/serve", label: "Join A Ministry" },
  { href: "/admin", label: "Leader Hub" },
];

const dtSocialTeamEmails = (
  process.env.NEXT_PUBLIC_DT_SOCIAL_TEAM_EMAILS ?? "keithshouldersjr@gmail.com,keith@example.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDtSocialLink, setShowDtSocialLink] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) return;

    function updateTeamLinks(email?: string | null) {
      const normalizedEmail = email?.toLowerCase();
      setShowDtSocialLink(Boolean(normalizedEmail && dtSocialTeamEmails.includes(normalizedEmail)));
    }

    supabase.auth.getUser().then(({ data }) => {
      updateTeamLinks(data.user?.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateTeamLinks(session?.user.email);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          className="h-10 w-10 px-0 !text-white"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      {isOpen ? (
        <nav className="border-t border-white/10 bg-[var(--brand-navy)] px-4 py-3 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-base font-medium !text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showDtSocialLink ? (
              <a
                href="/dtsocial/"
                className="rounded-2xl px-4 py-3 text-base font-medium !text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                DT Social
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
