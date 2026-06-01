import { WaveformDivider } from "@/components/ui/Waveform";

type SectionVariant = "first" | "default";

interface SectionShellProps {
  id: string;
  children: React.ReactNode;
  variant?: SectionVariant;
  divider?: boolean;
  className?: string;
  as?: "section" | "div";
}

const PADDING_X = "px-6 md:px-12 lg:px-20 xl:px-24";
const PADDING_BOTTOM = "pb-24 md:pb-32";

export function SectionShell({
  id,
  children,
  variant = "default",
  divider = false,
  className = "",
  as: Tag = "section",
}: SectionShellProps) {
  const paddingTop =
    variant === "first" ? "pt-10 md:pt-14" : "pt-20 md:pt-28";

  return (
    <Tag
      id={id}
      className={`relative z-10 scroll-mt-20 max-w-7xl mx-auto ${PADDING_X} ${PADDING_BOTTOM} ${paddingTop} ${className}`}
    >
      {divider && (
        <WaveformDivider className="-mt-4 md:-mt-6 mb-10 md:mb-12 text-white/10" />
      )}
      {children}
    </Tag>
  );
}

/** Shared display heading for tracks 02–05 */
export function SectionTitle({
  children,
  className = "",
  large = false,
}: {
  children: React.ReactNode;
  className?: string;
  large?: boolean;
}) {
  return (
    <h2
      className={`font-display font-bold text-text leading-[0.92] tracking-tight ${className}`}
      style={{
        fontSize: large
          ? "clamp(48px, 9vw, 140px)"
          : "clamp(40px, 6vw, 80px)",
        letterSpacing: large ? "-0.04em" : "-0.03em",
      }}
    >
      {children}
    </h2>
  );
}
