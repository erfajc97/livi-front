/**
 * Separador editorial LIVI (versión React) — "Dónde vive el caballito"
 * (PDF identidad): entre bloques editoriales, centrado, a 38 px,
 * línea — caballito — línea. Sustituye a cualquier título decorativo.
 */
export default function CaballitoDivider({
  tone = 'burgundy',
  className = '',
}: {
  tone?: 'burgundy' | 'butter' | 'espresso';
  className?: string;
}) {
  const line =
    tone === 'butter' ? 'bg-[#F5EFC6]/40' : tone === 'espresso' ? 'bg-text/30' : 'bg-accent/30';
  return (
    <div className={`flex items-center justify-center gap-5 ${className}`} aria-hidden="true">
      <span className={`h-px w-16 md:w-24 ${line}`} />
      <img
        src={`/caballito-${tone}.png`}
        alt=""
        width={38}
        height={31}
        loading="lazy"
        className="h-[31px] w-[38px] object-contain"
      />
      <span className={`h-px w-16 md:w-24 ${line}`} />
    </div>
  );
}
