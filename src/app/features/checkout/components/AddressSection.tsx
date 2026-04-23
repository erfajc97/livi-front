import type { CustomerFormData } from '../types';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-border px-0 py-2 text-sm text-black focus:ring-0 focus:border-black transition-colors';

const SELECT_CLASS =
  'w-full bg-transparent border-0 border-b border-border px-0 py-2 text-sm text-text-muted focus:ring-0 focus:border-black transition-colors cursor-pointer';

interface AddressSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
}

export default function AddressSection({ customer, onChange }: AddressSectionProps) {
  return (
    <section>
      <h2 className="font-heading font-bold text-black text-lg mb-4">Información de dirección</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5">
        <input
          type="text"
          placeholder="Dirección"
          value={customer.address}
          onChange={(e) => onChange('address', e.target.value)}
          className={`${INPUT_CLASS} md:col-span-2`}
          required
        />
        <select
          value={customer.province}
          onChange={(e) => onChange('province', e.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Provincia</option>
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
          <option value="Machala">Machala</option>
          <option value="Manta">Manta</option>
          <option value="Ambato">Ambato</option>
          <option value="Ibarra">Ibarra</option>
          <option value="Santo Domingo">Santo Domingo</option>
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
