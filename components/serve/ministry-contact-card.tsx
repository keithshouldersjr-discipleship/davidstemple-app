import { Phone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MinistryContact } from "@/lib/types";

type MinistryContactCardProps = {
  contact: MinistryContact;
};

function getPhoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `tel:${digits.length === 10 ? `+1${digits}` : digits}`;
}

export function MinistryContactCard({ contact }: MinistryContactCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]">
            <UserRound className="h-5 w-5" />
          </span>
          <Badge>{contact.category}</Badge>
        </div>
        <CardTitle>{contact.ministryName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {contact.description ? (
          <p className="text-sm leading-6 text-[var(--brand-muted)]">{contact.description}</p>
        ) : null}
        <div className="rounded-2xl bg-[var(--brand-soft)] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
            Ministry contact
          </p>
          <p className="mt-2 font-semibold text-[var(--brand-navy)]">{contact.leaderName}</p>
          <p className="mt-1 text-sm text-[var(--brand-muted)]">{contact.phone}</p>
        </div>
        <a href={getPhoneHref(contact.phone)} className="block">
          <Button size="sm" className="w-full">
            <Phone className="h-4 w-4" />
            Call or text
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
