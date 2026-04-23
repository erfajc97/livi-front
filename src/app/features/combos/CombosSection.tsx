import AppProviders from '@/app/providers/AppProviders';
import { useActiveCombosQuery } from '@/app/tanstack-queries/combosQuery';
import ComboGrid from './components/ComboGrid';

function CombosContent() {
  const { data: combos = [], isLoading } = useActiveCombosQuery();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <ComboGrid combos={combos} isLoading={isLoading} />
    </div>
  );
}

export default function CombosSection() {
  return (
    <AppProviders>
      <CombosContent />
    </AppProviders>
  );
}
