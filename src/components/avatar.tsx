import Image from "next/image";

import { objectPositionByName, photoByName } from "@/content/media";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .filter((p) => /[A-Za-z]/.test(p))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({
  name,
  image,
  size = 48,
  senior = false,
  className,
}: {
  name: string;
  image?: string;
  size?: number;
  senior?: boolean;
  className?: string;
}) {
  const resolved = image ?? photoByName[name];
  if (resolved) {
    return (
      <Image
        src={resolved}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size, objectPosition: objectPositionByName[name] ?? "center" }}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: senior
          ? "linear-gradient(135deg,#001965,#0e5453)"
          : "linear-gradient(135deg,#0e5453,#22b9aa)",
      }}
      aria-hidden="true"
    >
      {initials(name) || "·"}
    </div>
  );
}
