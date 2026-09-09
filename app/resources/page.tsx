import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Download } from "lucide-react";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { bibleStudy } from "@/lib/bible-study-data";
import { resources } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Church Resources | David's Temple",
  description:
    "Bible study materials, church information, care resources, ministry updates, and helpful links from David's Temple Missionary Baptist Church.",
};

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[var(--brand-burgundy)]">
          Resources
        </p>
        <h1 className="text-4xl font-semibold text-[var(--brand-navy)]">Resources for your growing</h1>
        <p className="text-lg leading-8 text-[var(--brand-muted)]">
          Prepare for Bible study, find helpful church information, and take your next step in worship, growth, service, or care.
        </p>
      </div>

      <section className="mb-12 overflow-hidden rounded-[2rem] bg-[var(--brand-navy)] text-white shadow-xl shadow-[#002F5F]/10">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#f2c4cf]">
              <BookOpen className="h-4 w-4" /> Featured Bible study
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              {bibleStudy.title}
            </h2>
            <p className="mt-3 text-lg leading-7 text-[#f2c4cf]">{bibleStudy.subtitle}</p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              Six mobile-friendly lessons with Scripture, discussion questions, private preparation notes, prayer, and the complete printable guide.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/study"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-burgundy)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a20b31]"
              >
                View the study <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={bibleStudy.pdfUrl}
                download
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
          <div className="relative hidden min-h-80 bg-[#efe6d3] md:block">
            <Image
              src={bibleStudy.coverUrl}
              alt={`${bibleStudy.title} Bible study cover`}
              fill
              sizes="256px"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
          All church resources
        </p>
      </div>
      <ResourceGrid resources={resources} />
    </main>
  );
}
