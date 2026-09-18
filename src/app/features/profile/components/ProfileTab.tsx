import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/app/store/auth/authStore';
import { useLogoutMutation } from '@/app/features/auth/mutations/useLogoutMutation';
import { useResendVerificationMutation } from '@/app/features/auth/mutations/useResendVerificationMutation';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import Loader from '@/app/components/Loader';
import { INPUT_UNDERLINE, LABEL_MONO } from '@/app/components/UI/formClasses';

// Mismo dialecto que checkout y auth: inputs subrayados, labels en mono.
// Antes eran cajas con borde completo y labels en `font-body`, que hacían
// ver la cuenta como un panel genérico y no como la tienda.
const INPUT = INPUT_UNDERLINE;
const INPUT_RO = `${INPUT_UNDERLINE} cursor-default text-text-soft`;
const SELECT =
  'w-full cursor-pointer appearance-none border-0 border-b border-border bg-transparent px-0 py-2.5 font-body text-sm text-text transition-colors focus:border-text focus:ring-0';
const LABEL = `mb-2 block ${LABEL_MONO}`;

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
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const loaded = useRef(false);
  // Correo que vino del backend: el cambio se detecta contra este valor,
  // no contra el store (que arranca vacío al recargar la página).
  const originalEmail = useRef(user?.email ?? '');

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    axiosInstance.get(API_ENDPOINTS.USER_ME).then(({ data }) => {
      const u = data?.data ?? data;
      setIsGoogleUser(u.authProvider === 'google');
      setEmail(u.email ?? '');
      originalEmail.current = u.email ?? '';
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
      // El store arranca sin usuario (no se persiste): poblarlo siempre para
      // que el header muestre el nombre y el checkout tenga los datos.
      setUser({
        id: String(u.id),
        name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email ?? user?.email ?? '',
        role: (user?.role ?? 'CLIENT') as 'ADMIN' | 'CLIENT',
        isEmailVerified: u.isEmailVerified ?? user?.isEmailVerified ?? true,
        phone: u.phone,
        cedula: u.cedula,
        province: u.province,
        city: u.city,
        address: u.address,
        reference: u.reference,
        preferredDeliveryMethod: u.preferredDeliveryMethod,
      });
    }).catch(() => {});
  }, []);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const emailChanged = !isGoogleUser && email.trim() !== '' && email.trim() !== originalEmail.current;
      const payload = emailChanged ? { ...form, email: email.trim() } : form;
      const { data } = await axiosInstance.patch(API_ENDPOINTS.USER_ME, payload);
      const u = data?.data ?? data;
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
      sonnerResponse('Perfil actualizado', 'success');
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      sonnerResponse(
        typeof msg === 'string' ? msg : 'Error al guardar',
        'error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwdForm.current || !pwdForm.next) {
      sonnerResponse('Completa la contraseña actual y la nueva', 'error');
      return;
    }
    if (pwdForm.next.length < 8) {
      sonnerResponse('La nueva contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      sonnerResponse('La confirmación no coincide', 'error');
      return;
    }
    setIsChangingPwd(true);
    try {
      await axiosInstance.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword: pwdForm.current,
        newPassword: pwdForm.next,
      });
      sonnerResponse('Contraseña actualizada', 'success');
      setPwdForm({ current: '', next: '', confirm: '' });
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      sonnerResponse(
        typeof msg === 'string' ? msg : 'No se pudo cambiar la contraseña',
        'error',
      );
    } finally {
      setIsChangingPwd(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-2xl font-normal text-text">Mi perfil</h2>
        <p className="mt-1 font-body text-sm text-text-soft">Administra tu información personal y de envío</p>
      </div>

      {/* Email verification warning */}
      {user && !user.isEmailVerified && (
        <div className="border border-warning/40 bg-warning-muted p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-warning">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="mb-3 font-body text-xs text-text-soft">Verifica tu email para desbloquear todas las funciones.</p>
              <button
                onClick={() => user.email && resendVerification(user.email)}
                disabled={isResending}
                className="bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {isResending ? <Loader size={14} color="#fff" /> : 'Reenviar correo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personal data */}
      <div className="border border-border bg-surface p-6">
        <span className="eyebrow mb-5 block">Datos personales</span>
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
              {isGoogleUser && <span className="ml-1.5 normal-case text-text-muted">(Google — no editable)</span>}
            </label>
            {isGoogleUser ? (
              <input type="email" value={email} readOnly className={INPUT_RO} />
            ) : (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={INPUT}
              />
            )}
            {!isGoogleUser && (
              <p className="mt-1.5 font-body text-[11px] text-text-muted">
                Si cambias el correo, úsalo en tu próximo inicio de sesión.
              </p>
            )}
          </div>
          <div>
            <label className={LABEL}>Cédula</label>
            <input
              type="text"
              inputMode="numeric"
              value={form.cedula}
              onChange={(e) => updateField('cedula', e.target.value.replace(/\D+/g, '').slice(0, 13))}
              placeholder="0912345678"
              maxLength={13}
              className={INPUT}
            />
          </div>
        </div>
      </div>

      {/* Contact & shipping */}
      <div className="border border-border bg-surface p-6">
        <span className="eyebrow mb-5 block">Contacto y envío</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Teléfono</label>
            <input
              type="tel"
              inputMode="numeric"
              value={form.phone}
              /* 10 dígitos, como en el checkout y en las direcciones. */
              onChange={(e) => updateField('phone', e.target.value.replace(/\D+/g, '').slice(0, 10))}
              placeholder="09XXXXXXXX"
              maxLength={10}
              className={INPUT}
            />
          </div>
          <div className="sm:col-span-2 border border-border-soft bg-bg-alt p-4">
            {/* Provincia, ciudad, dirección y referencia vivían también aquí:
                dos fuentes de verdad para el mismo envío, sin sincronizar y
                sin validación. La dirección se administra solo en su pestaña. */}
            <p className="font-body text-sm text-text-soft">
              Tus direcciones de envío se guardan en la pestaña{' '}
              <a
                href="#direcciones"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent underline"
              >
                Direcciones
              </a>
              , donde puedes tener varias y marcar una como predeterminada.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Método de envío preferido</label>
            <select value={form.preferredDeliveryMethod} onChange={(e) => updateField('preferredDeliveryMethod', e.target.value)} className={SELECT}>
              <option value="">Sin preferencia</option>
              <option value="ENTREGA_PERSONAL">Entrega personal Plaza Tía — Gratis</option>
              <option value="RETIRO_PIWU">Retiro en Piwu Market (Urdesa) — $2</option>
              <option value="SERVIENTREGA_GYE">Servientrega (GYE - Durán - Samborondón) — $3</option>
              <option value="SERVIENTREGA_NACIONAL">Servientrega Nacional (Provincias) — $6.50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seguridad — cambiar contraseña (solo cuentas con contraseña local) */}
      {!isGoogleUser && (
        <div className="border border-border bg-surface p-6">
          <span className="eyebrow mb-5 block">Seguridad</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={LABEL}>Contraseña actual</label>
              <input
                type="password"
                value={pwdForm.current}
                onChange={(e) => setPwdForm((p) => ({ ...p, current: e.target.value }))}
                autoComplete="current-password"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Nueva contraseña</label>
              <input
                type="password"
                value={pwdForm.next}
                onChange={(e) => setPwdForm((p) => ({ ...p, next: e.target.value }))}
                autoComplete="new-password"
                placeholder="Mín. 8 caracteres"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Confirmar nueva</label>
              <input
                type="password"
                value={pwdForm.confirm}
                onChange={(e) => setPwdForm((p) => ({ ...p, confirm: e.target.value }))}
                autoComplete="new-password"
                className={INPUT}
              />
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={handleChangePassword}
              disabled={isChangingPwd}
              className="border border-text px-8 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {isChangingPwd ? <Loader size={16} /> : 'Cambiar contraseña'}
            </button>
          </div>
        </div>
      )}

      {/* Save + Logout */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="gold-frame bg-accent px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.24em] text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isSaving ? <Loader size={16} color="currentColor" /> : 'Guardar cambios'}
        </button>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="border border-border px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-soft transition-colors hover:border-text hover:text-text disabled:opacity-50"
        >
          {isLoggingOut ? <Loader size={16} /> : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  );
}
