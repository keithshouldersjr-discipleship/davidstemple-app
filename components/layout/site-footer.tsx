import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/ask", label: "Ask" },
  { href: "/bulletin", label: "Bulletin" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/serve", label: "Join A Ministry" },
  { href: "/resources#visit", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-[var(--brand-muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <Image
            src="/davids-temple-logo-color.png"
            alt="David's Temple Missionary Baptist Church"
            width={3600}
            height={3600}
            className="h-16 w-28 object-contain sm:h-20 sm:w-36"
          />
          <div>
            <p className="font-semibold text-[var(--brand-navy)]">
              David&apos;s Temple Missionary Baptist Church
            </p>
            <p>Helping members and visitors stay connected.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--brand-burgundy)]">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
