import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PastorPage() {
  return (
    <main>
      <section className="bg-[var(--brand-navy)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-8 lg:py-14">
          <div className="space-y-5 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/70">Pastor Bio</p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Meet Pastor Keith</h1>
            <p className="max-w-2xl text-lg leading-8 text-white/80">
              Pastor Keith Shoulders II serves David&apos;s Temple with a heart for biblical preaching,
              discipleship, leadership development, and the Tanner community.
            </p>
            <Link href="/serve">
              <Button variant="light" size="lg">
                Join A Ministry
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="relative min-h-[24rem] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/30 sm:min-h-[32rem]">
            <Image
              src="/pastor/keith-shoulders.png"
              alt="Pastor Keith Shoulders II"
              fill
              priority
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm shadow-slate-900/5">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">At a glance</p>
              <div className="mt-5 grid gap-4 text-sm text-[var(--brand-muted)]">
                <p className="flex gap-3">
                  <Home className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                  Native of Tanner, Alabama, serving the community that helped shape him.
                </p>
                <p className="flex gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                  Samford University, Athens State University, and doctoral study in Educational Ministry.
                </p>
                <p className="flex gap-3">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                  Passionate about clear, practical, life-giving teaching from God&apos;s Word.
                </p>
                <p className="flex gap-3">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-burgundy)]" />
                  Devoted husband to Koleceia and proud father to Kennedi.
                </p>
              </div>
            </div>
          </aside>

          <article className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-8">
            <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
              <p>
                Keith Shoulders II serves as Pastor of David&apos;s Temple Missionary Baptist Church in Tanner, Alabama.
                As a native of Tanner, Pastor Keith has a deep love for the community that helped shape him, and he
                counts it a privilege to serve and give back in the same place that helped raise him.
              </p>
              <p>
                Before entering pastoral leadership, Keith graduated from Tanner High School in 2008 and went on to
                attend Samford University, where he played football as a two-year starter and earned a Bachelor&apos;s
                degree in Computer Science. He later earned a Master&apos;s in Religion from Athens State University and is
                currently pursuing a Doctor of Education in Educational Ministry.
              </p>
              <p>
                His journey through athletics, education, technology, leadership, and ministry has shaped his passion
                for helping people grow in faith, discipline, purpose, and service.
              </p>
              <p>
                Pastor Keith is especially passionate about teaching God&apos;s Word in a way that is clear, practical,
                and life-giving. He believes the church should be a place where people are welcomed, equipped, and
                encouraged to become who God has called them to be.
              </p>
              <p>
                Alongside his ministry at David&apos;s Temple, Pastor Keith&apos;s heart is to help strengthen the church
                through biblical preaching, discipleship, teaching, and leadership development.
              </p>
              <p>
                More than any title or accomplishment, Keith is grateful to be a devoted husband to his wife, Koleceia,
                and a proud father to their daughter, Kennedi. He considers his family one of God&apos;s greatest gifts in
                his life.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
