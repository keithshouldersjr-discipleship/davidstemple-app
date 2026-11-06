import { jamesSeries } from "@/lib/james-study-data";
import { jamesShareImageSize, renderJamesShareImage } from "@/lib/james-share-image";

export const alt = `${jamesSeries.title} — ${jamesSeries.eyebrow}`;
export const size = jamesShareImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderJamesShareImage({
    eyebrow: `${jamesSeries.eyebrow} · ${jamesSeries.season}`,
    title: jamesSeries.title,
  });
}
