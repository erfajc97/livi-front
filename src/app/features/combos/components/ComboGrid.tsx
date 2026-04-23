import ComboCard from './ComboCard';
import Loader from '@/app/components/Loader';
import type { Combo } from '@/app/types/global.types';

interface ComboGridProps {
  combos: Combo[];
  isLoading: boolean;
}

export default function ComboGrid({ combos, isLoading }: ComboGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={45} />
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">
          No hay combos disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {combos.map((combo) => (
        <ComboCard key={combo.id} combo={combo} />
      ))}
    </div>
  );
}
