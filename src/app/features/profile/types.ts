export type ProfileTabId = 'perfil' | 'direcciones' | 'pedidos';

/** Dirección de entrega guardada (GET /users/me/addresses). */
export interface Address {
  id: string;
  alias: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  telefono: string;
  isDefault: boolean;
}

/** Payload para crear/editar (POST/PATCH /users/me/addresses). */
export interface AddressPayload {
  alias: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  telefono: string;
  isDefault?: boolean;
}
