import AppProviders from '@/app/providers/AppProviders';
import { useProfileHook } from './hooks/useProfileHook';
import ProfileSidebar from './components/ProfileSidebar';
import TrackingTab from './components/TrackingTab';
import OrdersTab from './components/OrdersTab';
import ProfileTab from './components/ProfileTab';
import PaymentsTab from './components/PaymentsTab';

const TAB_CONTENT = {
  seguimiento: TrackingTab,
  pedidos: OrdersTab,
  perfil: ProfileTab,
  pagos: PaymentsTab,
} as const;

function ProfileContent() {
  const { activeTab, setActiveTab, user } = useProfileHook();
  const ActiveComponent = TAB_CONTENT[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-center text-xl font-heading font-bold tracking-wider text-black uppercase">
            Mi Cuenta — {user?.name ?? ''}
          </h1>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <ActiveComponent />
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <AppProviders>
      <ProfileContent />
    </AppProviders>
  );
}
