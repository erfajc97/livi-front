import logoSvg from '@/assets/logo.svg';

export default function PaymentConfirmation() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
      {/* Banner inside card */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/confirmation-banner.png"
          alt=""
          className="w-full h-[240px] sm:h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <img src={logoSvg.src} alt="NönDecants" className="h-14 sm:h-20" />
          <p className="text-white text-base sm:text-xl font-heading font-bold">
            ¡Gracias por hacer tu pedido con nosotros!
          </p>
        </div>
      </div>

      {/* Check + Message */}
      <div className="flex flex-col items-center text-center pt-8 pb-4 gap-5">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-black font-heading text-lg sm:text-2xl font-bold leading-snug max-w-md">
          Estaremos trabajando para suministrarte tú pedido lo más rapido posible.
        </p>
      </div>
    </div>
  );
}
