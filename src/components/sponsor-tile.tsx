import Image from "next/image";

import { logoByName } from "@/content/media";
import type { Sponsor } from "@/content/sponsors";

export function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const logoSrc = sponsor.logo ?? logoByName[sponsor.name];
  const content = (
    <div className="flex size-24 items-center justify-center rounded-2xl border border-mist bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md sm:size-28">
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={sponsor.name}
          width={80}
          height={80}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="display text-center text-base font-semibold leading-tight text-brand">
          {sponsor.name}
        </span>
      )}
    </div>
  );

  return (
    <figure className="flex flex-col items-center gap-2">
      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
          {content}
        </a>
      ) : (
        content
      )}
      <figcaption className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-slate-2">
        {sponsor.status === "confirmed" ? (
          <>
            <span className="size-1.5 rounded-full bg-accent-500" /> Confirmed sponsor
          </>
        ) : (
          "In conversation"
        )}
      </figcaption>
    </figure>
  );
}
