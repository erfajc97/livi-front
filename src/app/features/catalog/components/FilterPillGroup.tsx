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
      <p className="font-heading text-base font-semibold text-black mb-3 italic">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => handleToggle(opt.value)}
              className={`px-4 py-1.5 text-sm font-body rounded-full border transition-colors ${
                isActive
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black'
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
