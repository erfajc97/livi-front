import { INPUT_UNDERLINE } from '@/app/components/UI/formClasses';
import type { CustomerFormData } from '../types';

interface ContactSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
  /** Con sesión no se ofrece el bloque invitado / crear cuenta. */
  isAuthenticated: boolean;
  onLogin: () => void;
}

/**
 * Contacto: aquí solo el correo (a esa dirección llega la confirmación).
 * Nombre, cédula y demás van en el bloque de envío, más abajo.
 */
export default function ContactSection({
  customer,
  onChange,
  isAuthenticated,
  onLogin,
}: ContactSectionProps) {
  return (
    <section>
      <h2 className="mb-4 font-heading text-xl font-normal text-text">
        Información de contacto
      </h2>

      <input
        type="email"
        placeholder="Correo electrónico *"
        value={customer.email}
        onChange={(e) => onChange('email', e.target.value)}
        className={INPUT_UNDERLINE}
        required
      />

      {!isAuthenticated && (
        <div className="mt-4 flex flex-col items-start gap-2.5 border border-border bg-bg-alt px-4 py-3.5">
          <p className="font-body text-[12px] leading-snug text-text-soft">
            Sigues <span className="text-text">como invitado</span>: no necesitas cuenta para
            terminar el pedido.
          </p>
          <button
            type="button"
            onClick={onLogin}
            className="shrink-0 border-b border-text pb-0.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text transition-colors hover:border-accent hover:text-accent"
          >
            Crear cuenta o entrar
          </button>
        </div>
      )}
    </section>
  );
}
