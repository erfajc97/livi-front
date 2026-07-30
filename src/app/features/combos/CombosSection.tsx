import AppProviders from '@/app/providers/AppProviders';
import { useActiveCombosQuery } from '@/app/tanstack-queries/combosQuery';
import ComboEditorialList from './components/ComboEditorialList';

function CombosContent() {
  const { data: combos = [], isLoading } = useActiveCombosQuery();

  return (
    <div className="pb-12 md:pb-20">
      <ComboEditorialList combos={combos} isLoading={isLoading} />
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
