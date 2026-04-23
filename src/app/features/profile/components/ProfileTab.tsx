import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/app/store/auth/authStore';
import { useLogoutMutation } from '@/app/features/auth/mutations/useLogoutMutation';
import { useResendVerificationMutation } from '@/app/features/auth/mutations/useResendVerificationMutation';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import Loader from '@/app/components/Loader';

const INPUT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors';
const INPUT_RO =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-black cursor-default';
const SELECT =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors cursor-pointer';
const LABEL = 'block text-xs text-gray-400 mb-1';

export default function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { mutate: resendVerification, isPending: isResending } = useResendVerificationMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [email, setEmail] = useState(user?.email ?? '');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    reference: '',
    preferredDeliveryMethod: '',
  });
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    axiosInstance.get(API_ENDPOINTS.USER_ME).then(({ data }) => {
      const u = data?.data ?? data;
      setIsGoogleUser(u.authProvider === 'google');
      setEmail(u.email ?? '');
      setForm({
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        cedula: u.cedula ?? '',
        phone: u.phone ?? '',
        province: u.province ?? '',
        city: u.city ?? '',
        address: u.address ?? '',
        reference: u.reference ?? '',
        preferredDeliveryMethod: u.preferredDeliveryMethod ?? '',
      });
      if (user) {
        setUser({
          ...user,
          name: `${u.firstName} ${u.lastName}`.trim(),
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email ?? user.email,
          phone: u.phone,
          cedula: u.cedula,
          province: u.province,
          city: u.city,
          address: u.address,
          reference: u.reference,
          preferredDeliveryMethod: u.preferredDeliveryMethod,
        });
      }
    }).catch(() => {});
  }, []);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await axiosInstance.patch(API_ENDPOINTS.USER_ME, form);
      const u = data?.data ?? data;
      if (user) {
        setUser({
          ...user,
          name: `${u.firstName} ${u.lastName}`.trim(),
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          cedula: u.cedula,
          province: u.province,
          city: u.city,
          address: u.address,
          reference: u.reference,
          preferredDeliveryMethod: u.preferredDeliveryMethod,
        });
      }
      sonnerResponse('Perfil actualizado', 'success');
    } catch {
      sonnerResponse('Error al guardar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Mi Perfil</h2>
        <p className="text-xs text-gray-400 mt-0.5">Administra tu información personal y de envío</p>
      </div>

      {/* Email verification warning */}
      {user && !user.isEmailVerified && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-yellow-800 mb-2">Verifica tu email para desbloquear todas las funciones.</p>
              <button
                onClick={() => user.email && resendVerification(user.email)}
                disabled={isResending}
                className="px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {isResending ? <Loader size={14} color="#fff" /> : 'Reenviar correo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personal data */}
      <div className="rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-black text-sm mb-4">Datos personales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Nombre</label>
            <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Apellido</label>
            <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>
              Email
              {isGoogleUser && <span className="ml-1.5 text-[10px] text-gray-300">(Google — no editable)</span>}
            </label>
            <input type="email" value={email} readOnly className={INPUT_RO} />
          </div>
          <div>
            <label className={LABEL}>Cédula</label>
            <input type="text" value={form.cedula} onChange={(e) => updateField('cedula', e.target.value)} placeholder="0912345678" className={INPUT} />
          </div>
        </div>
      </div>

      {/* Contact & shipping */}
      <div className="rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-black text-sm mb-4">Contacto y envío</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Teléfono</label>
            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="09XXXXXXXX" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Provincia</label>
            <select value={form.province} onChange={(e) => updateField('province', e.target.value)} className={SELECT}>
              <option value="">Seleccionar</option>
              <option value="Guayas">Guayas</option>
              <option value="Pichincha">Pichincha</option>
              <option value="Azuay">Azuay</option>
              <option value="Manabi">Manabí</option>
              <option value="El Oro">El Oro</option>
              <option value="Los Rios">Los Ríos</option>
              <option value="Tungurahua">Tungurahua</option>
              <option value="Imbabura">Imbabura</option>
              <option value="Santo Domingo">Santo Domingo</option>
              <option value="Santa Elena">Santa Elena</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Ciudad</label>
            <select value={form.city} onChange={(e) => updateField('city', e.target.value)} className={SELECT}>
              <option value="">Seleccionar</option>
              <option value="Guayaquil">Guayaquil</option>
              <option value="Duran">Durán</option>
              <option value="Samborondon">Samborondón</option>
              <option value="Quito">Quito</option>
              <option value="Cuenca">Cuenca</option>
              <option value="Machala">Machala</option>
              <option value="Manta">Manta</option>
              <option value="Ambato">Ambato</option>
            </select>
          </div>
          <div>
            <label className={LABEL}>Dirección</label>
            <input type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Av. Principal 123" className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Referencia</label>
            <input type="text" value={form.reference} onChange={(e) => updateField('reference', e.target.value)} placeholder="Cerca de..." className={INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Método de envío preferido</label>
            <select value={form.preferredDeliveryMethod} onChange={(e) => updateField('preferredDeliveryMethod', e.target.value)} className={SELECT}>
              <option value="">Sin preferencia</option>
              <option value="ENTREGA_PERSONAL">Entrega personal Plaza Tía — Gratis</option>
              <option value="RETIRO_PIWU">Retiro en Piwu Market (Urdesa) — $2</option>
              <option value="SERVIENTREGA_GYE">Servientrega (GYE - Durán - Samborondón) — $3</option>
              <option value="SERVIENTREGA_NACIONAL">Servientrega Nacional (Provincias) — $7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save + Logout */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader size={16} color="#fff" /> : 'Guardar cambios'}
        </button>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? <Loader size={16} color="#fff" /> : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}
