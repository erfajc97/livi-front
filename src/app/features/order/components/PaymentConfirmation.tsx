export default function PaymentConfirmation() {
  return (
    <div className="border border-border bg-surface p-6 sm:p-10">
      {/* Banner burgundy con wordmark reversado + caballito (ref. PDF identidad) */}
      <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-accent px-6 py-12 text-center sm:py-16">
        <img src="/logo-livi-reversed.svg" alt="LIVI Ecuador" className="h-14 w-auto sm:h-16" />
        <div className="flex items-center justify-center gap-4" aria-hidden="true">
          <span className="h-px w-12 bg-butter/40" />
          <img src="/caballito-butter.png" alt="" className="h-[26px] w-8 object-contain" />
          <span className="h-px w-12 bg-butter/40" />
        </div>
        <p className="font-heading text-lg font-normal text-butter sm:text-2xl">
          ¡Gracias por hacer tu pedido con nosotros!
        </p>
      </div>

      {/* Check + Message */}
      <div className="flex flex-col items-center gap-5 pb-4 pt-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center bg-accent text-butter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="max-w-md font-heading text-lg font-normal leading-snug text-text sm:text-2xl">
          Estaremos trabajando para entregarte tu pedido lo más rápido posible.
        </p>
        <p className="font-body text-sm text-text-soft">
          Tu pieza sale del taller con empaque de regalo incluido.
        </p>
      </div>
    </div>
  );
}
