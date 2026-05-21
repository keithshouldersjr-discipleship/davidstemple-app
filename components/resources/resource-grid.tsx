"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ResourceCard } from "@/components/resources/resource-card";
import { Input } from "@/components/ui/input";
import type { Resource, ResourceCategory } from "@/lib/types";

const categories: ResourceCategory[] = [
  "Visit",
  "Grow",
  "Serve",
  "Care",
  "Give",
  "Ministry Updates",
];

type ResourceGridProps = {
  resources: Resource[];
};

export function ResourceGrid({ resources }: ResourceGridProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategory | "All">("All");

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resources
      .filter((resource) => resource.isActive)
      .filter((resource) => category === "All" || resource.category === category)
      .filter((resource) => {
        if (!normalizedQuery) return true;
        return `${resource.title} ${resource.description} ${resource.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [category, query, resources]);

  const groupedResources = useMemo(() => {
    return categories
      .map((item) => ({
        category: item,
        id: item.toLowerCase().replaceAll(" ", "-"),
        resources: filteredResources.filter((resource) => resource.category === item),
      }))
      .filter((group) => group.resources.length > 0);
  }, [filteredResources]);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-burgundy)]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search resources..."
            className="pl-11"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === item
                  ? "border-[var(--brand-burgundy)] bg-[var(--brand-burgundy)] text-white"
                  : "border-[var(--brand-border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-burgundy)]/35"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-10">
        {groupedResources.map((group) => (
          <section key={group.category} id={group.id} className="scroll-mt-28 space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--brand-burgundy)]">
                {group.category}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {filteredResources.length === 0 ? (
        <p className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 text-center text-[var(--brand-muted)]">
          No resources match that search yet.
        </p>
      ) : null}
    </div>
  );
}
