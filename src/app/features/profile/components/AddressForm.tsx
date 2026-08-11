import { useState } from 'react';
import Loader from '@/app/components/Loader';
import { validateAddressForm } from '../validators';
import type { Address, AddressPayload } from '../types';

const INPUT =
  'w-full border border-border bg-surface px-3.5 py-3 font-body text-sm text-text placeholder:text-text-muted focus:border-text focus:outline-none transition-colors';
const SELECT =
  'w-full cursor-pointer appearance-none border border-border bg-surface px-3.5 py-3 font-body text-sm text-text focus:border-text focus:outline-none transition-colors';
const LABEL = 'mb-2 block font-body text-[10px] uppercase tracking-[0.18em] text-text-muted';

const EMPTY_FORM: AddressPayload = {
  alias: '',
  provincia: '',
  ciudad: '',
  direccion: '',
  referencia: '',
  telefono: '',
  isDefault: false,
};

interface AddressFormProps {
  /** Dirección a editar; null/undefined = alta nueva. */
  initial?: Address | null;
  isPending: boolean;
  onSubmit: (payload: AddressPayload) => void;
  onCancel: () => void;
}

/** Formulario de alta/edición de dirección guardada (validación con Zod). */
export default function AddressForm({ initial, isPending, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<AddressPayload>(() =>
    initial
      ? {
          alias: initial.alias,
          provincia: initial.provincia,
          ciudad: initial.ciudad,
          direccion: initial.direccion,
          referencia: initial.referencia,
          telefono: initial.telefono,
          isDefault: initial.isDefault,
        }
      : EMPTY_FORM,
  );
  const [error, setError] = useState<string | null>(null);

  const updateField = (key: keyof AddressPayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: AddressPayload = {
      ...form,
      telefono: form.telefono.replace(/\D+/g, '').slice(0, 10),
    };
    const validationError = validateAddressForm(payload);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-surface p-6">
      <span className="eyebrow mb-5 block">
        {initial ? 'Editar dirección' : 'Nueva dirección'}
      </span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Alias *</label>
          <input
            type="text"
            value={form.alias}
            onChange={(e) => updateField('alias', e.target.value)}
            placeholder="Casa, Oficina…"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Teléfono *</label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.telefono}
            onChange={(e) => updateField('telefono', e.target.value.replace(/\D+/g, '').slice(0, 10))}
            placeholder="09XXXXXXXX"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Provincia *</label>
          <select
            value={form.provincia}
            onChange={(e) => updateField('provincia', e.target.value)}
            className={SELECT}
          >
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
          <label className={LABEL}>Ciudad *</label>
          <select
            value={form.ciudad}
            onChange={(e) => updateField('ciudad', e.target.value)}
            className={SELECT}
          >
            <option value="">Seleccionar</option>
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
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>Dirección *</label>
          <input
            type="text"
            value={form.direccion}
            onChange={(e) => updateField('direccion', e.target.value)}
            placeholder="Av. Principal 123 y Secundaria"
            className={INPUT}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={LABEL}>Referencia</label>
          <input
            type="text"
            value={form.referencia}
            onChange={(e) => updateField('referencia', e.target.value)}
            placeholder="Cerca de..."
            className={INPUT}
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={form.isDefault ?? false}
          onChange={(e) => updateField('isDefault', e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <span className="font-body text-xs text-text-soft">
          Usar como dirección predeterminada (se preselecciona en el checkout)
        </span>
      </label>

      {error && (
        <p className="mt-4 font-body text-xs text-error">{error}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-text px-8 py-3.5 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:opacity-50"
        >
          {isPending ? <Loader size={16} color="#fff" /> : initial ? 'Guardar cambios' : 'Guardar dirección'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="border border-border px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-text-soft transition-colors hover:border-text hover:text-text disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
