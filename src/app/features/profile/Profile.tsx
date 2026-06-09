import AppProviders from '@/app/providers/AppProviders';
import { useProfileHook } from './hooks/useProfileHook';
import ProfileSidebar from './components/ProfileSidebar';
import OrdersTab from './components/OrdersTab';
import ProfileTab from './components/ProfileTab';

const TAB_CONTENT = {
  perfil: ProfileTab,
  pedidos: OrdersTab,
} as const;

function ProfileContent() {
  const { activeTab, setActiveTab, user } = useProfileHook();
  const ActiveComponent = TAB_CONTENT[activeTab];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <span className="eyebrow">— Mi cuenta</span>
          <h1 className="mt-2 font-display text-3xl font-light leading-none tracking-[-0.01em] text-text md:text-4xl">
            {user?.name ?? 'Hola'}
          </h1>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:gap-14">
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
