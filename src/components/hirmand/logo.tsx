import { cn } from "@/lib/utils";

type LogoSize = "nav" | "hero" | "footer" | "soon";

export function BrandLogo({
  size = "nav",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  // The hero logo is the first brand mark on the homepage — load it eagerly;
  // the rest (header/footer) can defer until needed.
  const isHero = size === "hero";
  return (
    <img
      src="/images/hirmand-logo.png"
      alt="لوگوی گروه مشاورین املاک هیرمند"
      width={1457}
      height={1079}
      loading={isHero ? "eager" : "lazy"}
      fetchPriority={isHero ? "high" : "auto"}
      draggable={false}
      decoding="async"
      className={cn("brand-logo", `brand-logo-${size}`, className)}
    />
  );
}
