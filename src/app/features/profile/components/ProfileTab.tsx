import { useAuthStore } from '@/app/store/auth/authStore';
import { useLogoutMutation } from '@/app/features/auth/mutations/useLogoutMutation';
import { useResendVerificationMutation } from '@/app/features/auth/mutations/useResendVerificationMutation';
import { MOCK_ADDRESSES, MOCK_PREFERENCES } from '../data';
import Loader from '@/app/components/Loader';

export default function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const addresses = MOCK_ADDRESSES;
  const preferences = MOCK_PREFERENCES;
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { mutate: resendVerification, isPending: isResending } = useResendVerificationMutation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Mi Perfil</h2>
        <p className="text-sm text-gray-400 mt-0.5">Administra tu información personal</p>
      </div>

      {/* Email verification warning */}
      {user && !user.isEmailVerified && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 text-sm mb-1">Email no verificado</h3>
              <p className="text-xs text-yellow-800 mb-3">Verifica tu email para desbloquear todas las funciones de tu cuenta.</p>
              <button
                onClick={() => user.email && resendVerification(user.email)}
                disabled={isResending}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {isResending ? <Loader size={14} color="#fff" /> : 'Reenviar correo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personal data */}
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black text-sm">Datos personales</h3>
          <button className="text-xs font-semibold text-accent hover:underline">Editar</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nombre completo</label>
            <input
              type="text"
              value={user?.name ?? ''}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-black"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-black"
            />
          </div>
        </div>
      </div>

      {/* Saved addresses */}
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black text-sm">Direcciones guardadas</h3>
          <button className="text-xs font-semibold text-accent hover:underline">+ Agregar</button>
        </div>
        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                addr.selected ? 'border-accent bg-accent/5' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="address"
                checked={addr.selected}
                readOnly
                className="accent-[--color-accent] h-4 w-4"
              />
              <div>
                <p className="text-sm font-semibold text-black">{addr.label}</p>
                <p className="text-xs text-gray-400">{addr.address}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-black text-sm">Preferencias personales</h3>
          <button className="text-xs font-semibold text-accent hover:underline">+ Agregar</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {preferences.map((pref) => (
            <span
              key={pref}
              className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-700"
            >
              {pref}
            </span>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? <Loader size={16} color="#fff" /> : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}
