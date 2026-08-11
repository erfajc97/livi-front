import { z } from 'zod';
import type { AddressPayload } from './types';

/**
 * Dirección de entrega (campos estándar Ecuador).
 * Teléfono EC = 10 dígitos (09xxxxxxxx), igual que en checkout/validators.
 */
export const addressSchema = z.object({
  alias: z.string().trim().min(1, 'Ingresa un alias (ej. Casa, Oficina).'),
  provincia: z.string().trim().min(1, 'Selecciona la provincia.'),
  ciudad: z.string().trim().min(1, 'Selecciona la ciudad.'),
  direccion: z.string().trim().min(4, 'Ingresa la dirección completa.'),
  referencia: z.string().trim(),
  telefono: z.string().trim().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos.'),
  isDefault: z.boolean().optional(),
});

/**
 * Valida el formulario de dirección antes de guardar.
 * Devuelve el primer mensaje de error, o null si todo OK
 * (mismo estilo que validateContact del checkout).
 */
export function validateAddressForm(payload: AddressPayload): string | null {
  const result = addressSchema.safeParse(payload);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? 'Revisa los datos de la dirección.';
}
