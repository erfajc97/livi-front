import type { CustomerFormData } from '../types';
import type { Address } from '@/app/features/profile/types';

const INPUT_CLASS =
  'w-full border-0 border-b border-border bg-transparent px-0 py-2.5 font-body text-sm text-text placeholder:text-text-muted focus:border-text focus:ring-0 transition-colors';

const SELECT_CLASS =
  'w-full cursor-pointer border-0 border-b border-border bg-transparent px-0 py-2.5 font-body text-sm text-text-muted focus:border-text focus:ring-0 transition-colors';

interface AddressSectionProps {
  customer: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: string) => void;
  /** Retiro en tienda: no hace falta dirección ni provincia. */
  isPickup: boolean;
  /** Direcciones guardadas del usuario (REQ-062); vacío si es guest. */
  savedAddresses?: Address[];
  /** Dirección aplicada al formulario; null = "nueva dirección" a mano. */
  selectedAddressId?: string | null;
  onSelectAddress?: (id: string | null) => void;
}

/**
 * Datos de quien recibe: nombre, documento, teléfono y —si hay envío— la
 * dirección. Va al final del paso 1, después de elegir cómo recibir el pedido.
 * Si el usuario tiene direcciones guardadas, arriba va el selector para
 * autocompletar (la predeterminada ya viene preseleccionada).
 */
export default function AddressSection({
  customer,
  onChange,
  isPickup,
  savedAddresses = [],
  selectedAddressId = null,
  onSelectAddress,
}: AddressSectionProps) {
  const showSavedSelector = !isPickup && savedAddresses.length > 0 && onSelectAddress != null;

  return (
    <section>
      <h2 className="mb-1 text-center font-display text-xl font-light text-text">
        {isPickup ? '¿Quién retira el pedido?' : '¿Dónde enviamos tu pedido?'}
      </h2>
      <p className="mb-5 text-center font-body text-[11px] text-text-muted">
        {isPickup ? 'Datos de quien pasa a retirar' : 'Nombre y dirección de entrega'}
      </p>

      {showSavedSelector && (
        <div className="mb-6">
          <p className="mb-2.5 font-body text-[11px] uppercase tracking-[0.16em] text-text-muted">
            Usa una dirección guardada
          </p>
          <div className="flex flex-col gap-2">
            {savedAddresses.map((addr) => {
              const active = selectedAddressId === addr.id;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelectAddress?.(addr.id)}
                  className={`flex items-center gap-3 border px-4 py-3 text-left transition-colors ${
                    active ? 'border-text bg-bg-alt' : 'border-border hover:border-text'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      active ? 'border-text' : 'border-border'
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-text" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-body text-[13px] font-medium leading-snug text-text">
                        {addr.alias}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-accent/10 px-2 py-0.5 font-body text-[9px] uppercase tracking-[0.12em] text-accent">
                          Predeterminada
                        </span>
                      )}
                    </span>
                    <span className="block truncate font-body text-[11px] text-text-muted">
                      {addr.direccion}, {addr.ciudad}
                    </span>
                  </span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onSelectAddress?.(null)}
              className={`flex items-center gap-3 border px-4 py-3 text-left transition-colors ${
                selectedAddressId === null ? 'border-text bg-bg-alt' : 'border-border hover:border-text'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  selectedAddressId === null ? 'border-text' : 'border-border'
                }`}
              >
                {selectedAddressId === null && <span className="h-2 w-2 rounded-full bg-text" />}
              </span>
              <span className="font-body text-[13px] leading-snug text-text">
                Nueva dirección — escribir los datos a mano
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 gap-y-5 md:grid-cols-2">
        <input
          type="text"
          placeholder="Nombres *"
          value={customer.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={INPUT_CLASS}
          required
        />
        <input
          type="text"
          placeholder="Apellidos *"
          value={customer.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
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
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="Número telefónico (10 dígitos) *"
          value={customer.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={INPUT_CLASS}
          required
        />

        {!isPickup && (
          <input
            type="text"
            placeholder="Dirección *"
            value={customer.address}
            onChange={(e) => onChange('address', e.target.value)}
            className={`${INPUT_CLASS} md:col-span-2`}
            required
          />
        )}

        {!isPickup && (
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
        )}

        <select
          value={customer.city}
          onChange={(e) => onChange('city', e.target.value)}
          className={`${SELECT_CLASS} ${isPickup ? 'md:col-span-2' : ''}`}
          required
        >
          <option value="">Ciudad *</option>
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
          type="text"
          placeholder="Referencia (opcional)"
          value={customer.reference}
          onChange={(e) => onChange('reference', e.target.value)}
          className={`${INPUT_CLASS} md:col-span-2`}
        />
      </div>
    </section>
  );
}
