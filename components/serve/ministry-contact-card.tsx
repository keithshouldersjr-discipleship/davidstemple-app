import Image from "next/image";
import { Phone, UserRound } from "lucide-react";
import { InterestButton } from "@/components/connect/interest-button";
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

function getLeaderPhoto(leaderName: string) {
  const photos: Record<string, string> = {
    "maurice pryor": "/ministry-leaders/maurice-pryor.png",
    "shellia battles": "/ministry-leaders/shellia-battles.png",
    "antonio woodruff": "/ministry-leaders/antonio-woodruff.png",
    "tara lucas": "/ministry-leaders/tara-lucas.png",
    "jimmy and nicole andrews": "/ministry-leaders/jimmy-nicole-andrews.jpg",
    "jimmy & nicole andrews": "/ministry-leaders/jimmy-nicole-andrews.jpg",
    "nicole andrews": "/ministry-leaders/jimmy-nicole-andrews.jpg",
    "donald wicks": "/ministry-leaders/donald-wicks.jpeg",
    "rev donald wicks": "/ministry-leaders/donald-wicks.jpeg",
    "rev. donald wicks": "/ministry-leaders/donald-wicks.jpeg",
  };
  const normalizedName = leaderName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();

  return photos[normalizedName];
}

export function MinistryContactCard({ contact }: MinistryContactCardProps) {
  const leaderPhoto = getLeaderPhoto(contact.leaderName);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          {leaderPhoto ? (
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-sm shadow-slate-900/15">
              <Image
                src={leaderPhoto}
                alt={contact.leaderName}
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]">
              <UserRound className="h-8 w-8" />
            </span>
          )}
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
        <div className="grid gap-2">
          <InterestButton
            sourceType="ministry"
            sourceId={contact.id}
            sourceTitle={contact.ministryName}
            interestArea={contact.ministryName}
            className="w-full"
          />
          <a href={getPhoneHref(contact.phone)} className="block">
            <Button size="sm" variant="secondary" className="w-full">
              <Phone className="h-4 w-4" />
              Call or text
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
