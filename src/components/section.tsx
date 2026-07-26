import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl",
        className,
      )}
    >
      <p className={cn("eyebrow", invert && "text-teal-300")}>{eyebrow}</p>
      <h2
        className={cn(
          "display mt-3 text-3xl font-semibold sm:text-4xl",
          invert ? "text-white" : "text-brand",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7",
            invert ? "text-slate-300" : "text-slate-1",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
