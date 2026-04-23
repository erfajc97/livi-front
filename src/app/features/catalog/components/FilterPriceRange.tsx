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
      <p className="font-heading text-base font-semibold text-black mb-3 italic">
        {label}
      </p>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm text-text-muted">{min}</span>
        <span className="text-sm font-semibold text-black">${value}</span>
        <span className="text-sm text-text-muted">{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-surface-raised accent-neutral-900"
      />
    </div>
  );
}
