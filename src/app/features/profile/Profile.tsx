import AppProviders from '@/app/providers/AppProviders';
import { Component } from 'react';
import { useProfileHook } from './hooks/useProfileHook';
import ProfileSidebar from './components/ProfileSidebar';
import OrdersTab from './components/OrdersTab';
import ProfileTab from './components/ProfileTab';
import AddressesTab from './components/AddressesTab';

const TAB_CONTENT = {
  perfil: ProfileTab,
  direcciones: AddressesTab,
  pedidos: OrdersTab,
} as const;

/** Si una pestaña falla al renderizar, la página no muere: se muestra un
    aviso y el sidebar sigue navegable. */
class TabErrorBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.error('[mi-cuenta] error en pestaña:', err); }
  render() {
    if (this.state.failed) {
      return (
        <div className="border border-border bg-surface p-6">
          <p className="font-body text-sm text-text">No se pudo cargar esta sección.</p>
          <button
            type="button"
            onClick={() => this.setState({ failed: false })}
            className="mt-3 border-b border-text pb-0.5 font-body text-xs text-text transition-colors hover:border-accent hover:text-accent"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProfileContent() {
  const { activeTab, setActiveTab, user } = useProfileHook();
  const ActiveComponent = TAB_CONTENT[activeTab];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 md:px-8">
          <span className="eyebrow">— Mi cuenta</span>
          <h1 className="mt-2 font-heading text-3xl font-normal leading-none tracking-[-0.01em] text-text md:text-4xl">
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
            <TabErrorBoundary key={activeTab}>
              <ActiveComponent />
            </TabErrorBoundary>
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
