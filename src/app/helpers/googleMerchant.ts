export const GOOGLE_MERCHANT_ID = 5847763007;

declare global {
  interface Window {
    gapi?: {
      load: (name: string, callback: () => void) => void;
      surveyoptin?: {
        render: (options: {
          merchant_id: number;
          order_id: string;
          email: string;
          delivery_country: string;
          estimated_delivery_date: string;
          products?: Array<{ gtin: string }>;
        }) => void;
      };
      ratingbadge?: {
        render: (
          element: HTMLElement,
          options: { merchant_id: number; position: 'INLINE' | 'BOTTOM_RIGHT' | 'BOTTOM_LEFT' },
        ) => void;
      };
    };
  }
}

function whenGapiReady(callback: () => void) {
  if (window.gapi) {
    callback();
    return;
  }
  const started = Date.now();
  const timer = window.setInterval(() => {
    if (window.gapi) {
      window.clearInterval(timer);
      callback();
      return;
    }
    if (Date.now() - started > 12_000) window.clearInterval(timer);
  }, 200);
}

/** Popup de Google Customer Reviews: solo en la página de pedido confirmado. */
export function startGoogleReviewOptIn(input: {
  orderId: string;
  email?: string | null;
  estimatedDeliveryDate: string;
}) {
  const email = input.email?.trim();
  const orderId = String(input.orderId || '').trim();
  if (!email || !orderId || typeof window === 'undefined') return;

  whenGapiReady(() => {
    window.gapi?.load('surveyoptin', () => {
      window.gapi?.surveyoptin?.render({
        merchant_id: GOOGLE_MERCHANT_ID,
        order_id: orderId,
        email,
        delivery_country: 'EC',
        estimated_delivery_date: input.estimatedDeliveryDate,
      });
    });
  });
}
