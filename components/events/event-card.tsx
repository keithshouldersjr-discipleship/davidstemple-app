import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <p className="text-sm leading-6 text-[var(--brand-muted)]">{event.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm text-[var(--brand-muted)]">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[var(--brand-burgundy)]" />
            {event.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--brand-burgundy)]" />
            {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand-burgundy)]" />
            {event.location}
          </span>
        </div>
        {event.registrationUrl ? (
          <Link href={event.registrationUrl}>
            <Button variant="secondary" size="sm">
              Register
            </Button>
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
