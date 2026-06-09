import AppProviders from '@/app/providers/AppProviders';
import { useActiveCombosQuery } from '@/app/tanstack-queries/combosQuery';
import ComboGrid from './components/ComboGrid';

function CombosContent() {
  const { data: combos = [], isLoading } = useActiveCombosQuery();

  return (
    <div className="px-6 pb-20 pt-10 md:px-14">
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
