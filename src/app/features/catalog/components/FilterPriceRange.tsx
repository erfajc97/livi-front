interface FilterPriceRangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export default function FilterPriceRange({
  label,
  min,
  max,
  value,
  onChange,
}: FilterPriceRangeProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-body text-sm text-text-muted">{min}</span>
        <span className="font-body text-sm text-text">${value}</span>
        <span className="font-body text-sm text-text-muted">{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-px appearance-none cursor-pointer bg-border accent-accent"
      />
    </div>
  );
}
