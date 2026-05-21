import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/ask", label: "Ask" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-navy)]/96 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/davids-temple-logo-white.png"
            alt="David's Temple Missionary Baptist Church"
            width={3600}
            height={3600}
            priority
            className="h-10 w-36 object-cover object-[center_62%] sm:w-40"
          />
          <span className="hidden text-base font-semibold tracking-wide text-white sm:inline">
            David&apos;s Temple App
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/ask">
          <Button size="sm">
            <MessageCircle className="h-4 w-4" />
            Ask ask.dt
          </Button>
        </Link>
      </div>
    </header>
  );
}
