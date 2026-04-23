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
    const paymentId = params.get('id');
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
      setError('No se encontraron datos de pago.');
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
        <div className="w-10 h-10 border-3 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Verificando tu pago...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center text-center py-16 gap-5">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className="font-heading text-2xl font-bold text-black">Pago no completado</h1>
        <p className="text-gray-500 text-sm max-w-sm">{error}</p>
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
        <p className="text-gray-500 text-sm">
          Orden: <span className="font-bold text-black">{order.orderNumber}</span>
        </p>
      )}

      {!isTransfer && order?.total ? (
        <p className="text-gray-500 text-sm">
          Total pagado: <span className="font-bold text-black">{formatCurrency(order.total)}</span>
        </p>
      ) : null}

      {/* Transfer: upload receipt */}
      {isTransfer && (
        <div className="w-full max-w-md text-left">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-bold text-amber-800 mb-1">Transferencia pendiente</p>
            <p className="text-xs text-amber-700">
              Realiza la transferencia y sube tu comprobante aquí. Tu orden será procesada una vez confirmado el pago.
            </p>
          </div>

          {receiptUploaded ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-sm font-bold text-green-800">Comprobante subido. Te notificaremos cuando confirmemos tu pago.</p>
            </div>
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadReceipt(f);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-black transition-colors disabled:opacity-50"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-medium text-gray-500">
                  {uploading ? 'Subiendo...' : 'Subir comprobante de transferencia'}
                </span>
                <span className="text-xs text-gray-400">JPG, PNG o PDF</span>
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-gray-400 text-xs max-w-sm mt-2">
        Te enviaremos los detalles a <span className="font-medium">{order?.customerEmail || 'tu correo'}</span>.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
        <a href="/mi-cuenta" className="flex-1 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors text-center">
          Ver mi pedido
        </a>
        <a href="/catalogo" className="flex-1 border border-gray-300 text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors text-center">
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
