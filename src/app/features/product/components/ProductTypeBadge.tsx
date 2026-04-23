interface ProductTypeBadgeProps {
  label: string;
}

export default function ProductTypeBadge({ label }: ProductTypeBadgeProps) {
  return (
    <span
      className="inline-block px-3 py-1 text-xs font-heading tracking-wider uppercase bg-accent text-bg rounded"
    >
      {label}
    </span>
  );
}
