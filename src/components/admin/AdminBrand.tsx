import Image from "next/image";
import Link from "next/link";

export default function AdminBrand({
  compact = false,
  href = "/admin",
}: {
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={`mp-brand ${compact ? "mp-brand-compact" : ""}`}
      aria-label="Meppeplin Decor Hub dashboard"
    >
      <Image
        src="/images/brand/mepepplin-logo.png"
        alt="Meppeplin Decor Hub"
        width={164}
        height={90}
        priority
        style={{
          width: "auto",
          maxWidth: "100%",
          height: "auto",
          maxHeight: compact ? 44 : 80,
          objectFit: "contain",
        }}
      />
    </Link>
  );
}