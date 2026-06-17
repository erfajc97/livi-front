import AppProviders from '@/app/providers/AppProviders';
import CartPage from './components/CartPage';

// Island del carrito (página completa). AppProviders → QueryClient (login modal)
// + Toaster. El estado vive en el Zustand store compartido.
export default function CartPageIsland() {
  return (
    <AppProviders withToaster>
      <CartPage />
    </AppProviders>
  );
}
