import type { CustomerFormData } from '../types';

const INPUT_CLASS =
  'w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-body text-sm text-text placeholder:text-text-muted focus:border-text focus:ring-0 transition-colors';

interface ContactSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
}

export default function ContactSection({ customer, onChange }: ContactSectionProps) {
  return (
    <section>
      <h2 className="eyebrow mb-5">Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5">
        <input
          type="text"
          placeholder="Nombres"
          value={customer.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={INPUT_CLASS}
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={customer.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          className={INPUT_CLASS}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={customer.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={INPUT_CLASS}
          required
        />
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={13}
          placeholder="Cédula / RUC"
          value={customer.cedula}
          onChange={(e) => onChange('cedula', e.target.value)}
          className={INPUT_CLASS}
        />
        <input
          type="text"
          placeholder="Referencia (Opcional)"
          value={customer.reference}
          onChange={(e) => onChange('reference', e.target.value)}
          className={`${INPUT_CLASS} md:col-span-2`}
        />
      </div>
    </section>
  );
}
