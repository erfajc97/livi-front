import { BTN_PRIMARY, LABEL_MONO } from '@/app/components/UI/formClasses';

interface OrderTrackingProps {
  trackingCode?: string;
}

export default function OrderTracking({ trackingCode }: OrderTrackingProps) {
  if (!trackingCode) {
    return (
      <div className="border border-border bg-surface p-5">
        <p className={`${LABEL_MONO} mb-2`}>Seguimiento Servientrega</p>
        <p className="font-body text-sm text-text-soft">
          El código de seguimiento estará disponible cuando el pedido sea despachado.
        </p>
      </div>
    );
  }

  const trackingUrl = `https://www.servientrega.com.ec/Tracking/Index/?guia=${encodeURIComponent(trackingCode)}`;

  const handleTrackingClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(trackingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="border border-border bg-surface p-5">
      <p className={`${LABEL_MONO} mb-2`}>Seguimiento Servientrega</p>
      <p className="mb-3 font-heading text-lg tabular-nums text-accent">{trackingCode}</p>
      <a
        href={trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTrackingClick}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 no-underline sm:max-w-sm ${BTN_PRIMARY}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        Rastrear envío en Servientrega
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  );
}
