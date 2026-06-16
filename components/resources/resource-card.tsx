import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  HandCoins,
  Heart,
  HeartHandshake,
  MapPin,
  Mic,
  Phone,
  School,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Resource } from "@/lib/types";

const icons = {
  BookOpen,
  CalendarDays,
  HandCoins,
  Heart,
  HeartHandshake,
  MapPin,
  Mic,
  Phone,
  School,
  Sparkles,
  UserRound,
};

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = resource.icon ? icons[resource.icon as keyof typeof icons] : Sparkles;

  return (
    <Link href={resource.url} className="group block h-full">
      <Card className="h-full transition hover:-translate-y-1 hover:border-[var(--brand-burgundy)]/35 hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)] group-hover:bg-[var(--brand-burgundy-soft)] group-hover:text-[var(--brand-burgundy)]">
              <Icon className="h-5 w-5" />
            </span>
            <Badge>{resource.category}</Badge>
          </div>
          <CardTitle>{resource.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-[var(--brand-muted)]">{resource.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
