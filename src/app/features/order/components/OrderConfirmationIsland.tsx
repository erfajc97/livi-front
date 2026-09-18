import { prepareReceiptUpload } from '@/app/helpers/prepareImageUpload';
import { useState, useEffect, useRef } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import GoogleReviewOptIn from './GoogleReviewOptIn';

type Status = 'loading' | 'paid' | 'failed' | 'transfer';

interface OrderData {
  id?: number;
  orderNumber: string;
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  customerEmail?: string;
  transferReceiptUrl?: string;
}

function OrderConfirmationContent() {
  const [status, setStatus] = useState<Status>('loading');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // PayPhone may send 'id' or 'paymentId'
    const paymentId = params.get('id') || params.get('paymentId');
    const clientTransactionId = params.get('clientTransactionId');
    const orderId = params.get('orderId');
    const method = params.get('method');

    if (method === 'TRANSFERENCIA' && orderId) {
      setStatus('transfer');
      setOrder({ orderNumber: String(orderId), total: 0, id: Number(orderId) || undefined });
      return;
    }

    if (paymentId && clientTransactionId) {
      verifyPayment(paymentId, clientTransactionId);
    } else {
      setStatus('failed');
      setError(
        `No se encontraron datos de pago. Parámetros recibidos: ${window.location.search || '(ninguno)'}`,
      );
    }
  }, []);

  const verifyPayment = async (paymentId: string, clientTransactionId: string) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.VERIFY_PAYMENT, {
        params: { id: paymentId, clientTransactionId },
      });
      const result = data?.data ?? data;

      if (result.paymentStatus === 'paid' || result.approved) {
        setStatus('paid');
        setOrder(result.order);
      } else {
        setStatus('failed');
        setError(result.transactionStatusName || 'Pago no aprobado');
      }
    } catch (err: any) {
      setStatus('failed');
      setError(err.response?.data?.message || 'Error al verificar el pago');
    }
  };

  const handleUploadReceipt = async (file: File) => {
    if (!order?.id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('receipt', await prepareReceiptUpload(file));
      await axiosInstance.post(`/payments/${order.id}/upload-receipt`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setReceiptUploaded(true);
      sonnerResponse('Comprobante subido exitosamente', 'success');
    } catch {
      sonnerResponse('Error al subir el comprobante', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-text" />
        <p className="font-body text-sm text-text-muted">Verificando tu pago...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center text-center py-10 md:py-16 gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-muted text-error">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-light text-text">Pago no completado</h1>
        <p className="max-w-sm font-body text-sm text-text-muted">{error}</p>
        <a href="/checkout" className="mt-4 bg-text px-8 py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent">
          Intentar de nuevo
        </a>
      </div>
    );
  }

  const isTransfer = status === 'transfer';

  return (
    <div className="flex flex-col items-center text-center py-12 gap-6">
      <GoogleReviewOptIn
        orderId={order?.id || order?.orderNumber}
        email={order?.customerEmail}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-muted text-success">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-display text-3xl font-light text-text md:text-4xl">
        {isTransfer ? '¡Orden registrada!' : '¡Pago exitoso!'}
      </h1>

      {order?.orderNumber && (
        <p className="font-body text-sm text-text-muted">
          Orden: <span className="text-text">{order.orderNumber}</span>
        </p>
      )}

      {!isTransfer && order?.total ? (
        <p className="font-body text-sm text-text-muted">
          Total pagado: <span className="text-text">{formatCurrency(order.total)}</span>
        </p>
      ) : null}

      {/* Transfer: receipt already uploaded during checkout */}
      {isTransfer && (
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 border-l-2 border-success bg-bg-alt px-4 py-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="font-body text-sm text-text-soft">Comprobante enviado. Te notificaremos cuando confirmemos tu pago.</p>
          </div>
        </div>
      )}

      <p className="mt-2 max-w-sm font-body text-xs text-text-muted">
        Te enviaremos los detalles a <span className="text-text-soft">{order?.customerEmail || 'tu correo'}</span>.
      </p>

      <div className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <a href="/mi-cuenta" className="flex-1 bg-text px-6 py-4 text-center font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent">
          Ver mi pedido
        </a>
        <a href="/catalogo" className="flex-1 border border-border px-6 py-4 text-center font-body text-xs uppercase tracking-[0.2em] text-text transition-colors hover:border-text">
          Seguir comprando
        </a>
      </div>
    </div>
  );
}

export default function OrderConfirmationIsland() {
  return (
    <AppProviders>
      <OrderConfirmationContent />
    </AppProviders>
  );
}
