const SEARCH_OPTIONS = [
  { value: "guia", label: "Guía" },
  { value: "remision", label: "Remisión" },
  { value: "factura", label: "Factura" }
];
const SEARCH_PLACEHOLDERS = {
  guia: "Número de Guía : Ejemplo 34353466",
  remision: "Número de Remisión : Ejemplo 12345678",
  factura: "Número de Factura : Ejemplo 87654321"
};
const ORDER_STATUS_CONFIG = {
  PENDING: { label: "Pendiente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" },
  CONFIRMED: { label: "Confirmada", color: "bg-blue-500/20 text-blue-400 border-blue-500/40" },
  PROCESSING: { label: "En proceso", color: "bg-purple-500/20 text-purple-400 border-purple-500/40" },
  SHIPPED: { label: "Enviada", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40" },
  DELIVERED: { label: "Entregada", color: "bg-success/20 text-success border-success/40" },
  CANCELLED: { label: "Cancelada", color: "bg-error/20 text-error border-error/40" }
};

export { ORDER_STATUS_CONFIG as O, SEARCH_OPTIONS as S, SEARCH_PLACEHOLDERS as a };
