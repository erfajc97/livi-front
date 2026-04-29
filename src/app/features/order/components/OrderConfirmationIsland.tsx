import { useState, useEffect, useRef } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import axiosInstance from '@/app/config/axiosConfig';
import { API_ENDPOINTS } from '@/app/api/endpoints';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';

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

    console.log('[OrderConfirmation] URL params:', {
      paymentId,
      clientTransactionId,
      orderId,
      method,
      fullSearch: window.location.search,
    });

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
      formData.append('receipt', file);
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-3 border-border border-t-black rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Verificando tu pago...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center text-center py-16 gap-5">
        <div className="w-14 h-14 rounded-full bg-error flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold text-black">Pago no completado</h1>
        <p className="text-text-muted text-sm max-w-sm">{error}</p>
        <a href="/checkout" className="mt-4 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors">
          Intentar de nuevo
        </a>
      </div>
    );
  }

  const isTransfer = status === 'transfer';

  return (
    <div className="flex flex-col items-center text-center py-12 gap-6">
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-heading text-2xl font-bold text-black">
        {isTransfer ? '¡Orden registrada!' : '¡Pago exitoso!'}
      </h1>

      {order?.orderNumber && (
        <p className="text-text-muted text-sm">
          Orden: <span className="font-bold text-black">{order.orderNumber}</span>
        </p>
      )}

      {!isTransfer && order?.total ? (
        <p className="text-text-muted text-sm">
          Total pagado: <span className="font-bold text-black">{formatCurrency(order.total)}</span>
        </p>
      ) : null}

      {/* Transfer: receipt already uploaded during checkout */}
      {isTransfer && (
        <div className="w-full max-w-md">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-sm font-bold text-green-800">Comprobante enviado. Te notificaremos cuando confirmemos tu pago.</p>
          </div>
        </div>
      )}

      <p className="text-text-muted text-xs max-w-sm mt-2">
        Te enviaremos los detalles a <span className="font-medium">{order?.customerEmail || 'tu correo'}</span>.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
        <a href="/mi-cuenta" className="flex-1 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors text-center">
          Ver mi pedido
        </a>
        <a href="/catalogo" className="flex-1 border border-border text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-surface-raised transition-colors text-center">
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
