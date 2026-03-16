import type { CustomerFormData } from '../types';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-black focus:ring-0 focus:border-black transition-colors';

interface ContactSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
}

export default function ContactSection({ customer, onChange }: ContactSectionProps) {
  return (
    <section>
      <h2 className="font-bold text-black text-lg mb-4">Contacto</h2>
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
          className={INPUT_CLASS}
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
          placeholder="Cédula"
          className={INPUT_CLASS}
        />
        <input
          type="text"
          placeholder="Referencia (Opcional)"
          className={`${INPUT_CLASS} md:col-span-2`}
        />
      </div>
    </section>
  );
}
