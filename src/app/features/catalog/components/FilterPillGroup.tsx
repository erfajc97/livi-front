interface FilterPillGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  singleSelect?: boolean;
}

export default function FilterPillGroup({
  label,
  options,
  selected,
  onChange,
  singleSelect = false,
}: FilterPillGroupProps) {
  const handleToggle = (value: string) => {
    if (singleSelect) {
      onChange(selected.includes(value) ? [] : [value]);
    } else {
      onChange(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value],
      );
    }
  };

  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={`px-4 py-1.5 font-body text-xs tracking-wide border transition-colors ${
                isActive
                  ? 'bg-text text-bg border-text'
                  : 'bg-transparent text-text-soft border-border hover:border-text'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
