import type { CustomerFormData } from '../types';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-black focus:ring-0 focus:border-black transition-colors';

const SELECT_CLASS =
  'w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-gray-500 focus:ring-0 focus:border-black transition-colors cursor-pointer';

interface AddressSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
}

export default function AddressSection({ customer, onChange }: AddressSectionProps) {
  return (
    <section>
      <h2 className="font-bold text-black text-lg mb-4">Información de dirección</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5">
        <input
          type="text"
          placeholder="Dirección"
          value={customer.address}
          onChange={(e) => onChange('address', e.target.value)}
          className={`${INPUT_CLASS} md:col-span-2`}
          required
        />
        <select className={SELECT_CLASS}>
          <option value="">Provincia</option>
          <option value="Guayas">Guayas</option>
          <option value="Pichincha">Pichincha</option>
          <option value="Azuay">Azuay</option>
        </select>
        <select
          value={customer.city}
          onChange={(e) => onChange('city', e.target.value)}
          className={SELECT_CLASS}
          required
        >
          <option value="">Ciudad</option>
          <option value="Guayaquil">Guayaquil</option>
          <option value="Duran">Durán</option>
          <option value="Samborondon">Samborondón</option>
          <option value="Quito">Quito</option>
          <option value="Cuenca">Cuenca</option>
        </select>
        <input
          type="tel"
          placeholder="Número telefónico"
          value={customer.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`${INPUT_CLASS} md:col-span-2`}
          required
        />
      </div>
    </section>
  );
}
