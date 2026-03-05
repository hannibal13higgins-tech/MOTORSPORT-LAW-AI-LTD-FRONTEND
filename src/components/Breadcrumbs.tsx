import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#6B7280]">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="text-[#1E3A5F] hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#111827] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
