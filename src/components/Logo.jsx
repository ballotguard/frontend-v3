import Image from "next/image";
import Link from "next/link";

/**
 * Logo component — renders the BallotGuard logo image.
 *
 * Props:
 *   size   — pixel size of the square logo (default 32)
 *   href   — if provided, wraps logo in a link (default "/")
 *   label  — aria-label for the link (default "BallotGuard home")
 *   className — extra classes on the wrapper
 */
export function Logo({ size = 32, href = "/", label = "BallotGuard home", className = "" }) {
  const img = (
    <Image
      src="/logo.png"
      alt="BallotGuard logo"
      width={size}
      height={size}
      className="rounded-md object-cover"
      priority
    />
  );

  if (!href) return <span className={`inline-flex ${className}`}>{img}</span>;

  return (
    <Link href={href} aria-label={label} className={`inline-flex ${className}`}>
      {img}
    </Link>
  );
}
