import { useEffect } from 'react';
import { estimatedDeliveryIso } from '@/app/helpers/deliveryWindow';
import { startGoogleReviewOptIn } from '@/app/helpers/googleMerchant';

interface GoogleReviewOptInProps {
  orderId?: string | number | null;
  email?: string | null;
  deliveryMethod?: string;
  hasBackorder?: boolean;
}

/** Dispara el popup de reseñas de Google una vez hay pedido + email. */
export default function GoogleReviewOptIn({
  orderId,
  email,
  deliveryMethod,
  hasBackorder = false,
}: GoogleReviewOptInProps) {
  useEffect(() => {
    if (!orderId || !email) return;
    startGoogleReviewOptIn({
      orderId: String(orderId),
      email,
      estimatedDeliveryDate: estimatedDeliveryIso(deliveryMethod, hasBackorder),
    });
  }, [orderId, email, deliveryMethod, hasBackorder]);

  return null;
}
