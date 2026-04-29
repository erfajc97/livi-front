import { useRef, useState } from 'react';
import Loader from '@/app/components/Loader';

interface TransferBankInfoStepProps {
  total: number;
  isPending: boolean;
  onConfirm: (receiptFile: File) => void;
  onBack: () => void;
}

const BANK_INFO = {
  bank: 'Banco Pichincha',
  accountType: 'Cuenta de Ahorros',
  accountNumber: '2206573833',
  name: 'NönDecants',
  cedula: '0924538271',
  email: 'nondecants@gmail.com',
};

export default function TransferBankInfoStep({ total, isPending, onConfirm, onBack }: TransferBankInfoStepProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setReceiptFile(file);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-heading font-bold text-black text-lg">Datos para transferencia</h2>

      <p className="text-sm text-gray-600">
        Realiza la transferencia por <strong className="text-black">${total.toFixed(2)}</strong> a la siguiente cuenta y sube tu comprobante.
      </p>

      {/* Bank details card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Banco</span>
          <span className="font-bold text-blue-900">{BANK_INFO.bank}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Tipo de cuenta</span>
          <span className="font-bold text-blue-900">{BANK_INFO.accountType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Numero de cuenta</span>
          <span className="font-bold text-blue-900 font-mono">{BANK_INFO.accountNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Nombre</span>
          <span className="font-bold text-blue-900">{BANK_INFO.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Cedula / RUC</span>
          <span className="font-bold text-blue-900">{BANK_INFO.cedula}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-700">Email</span>
          <span className="font-bold text-blue-900">{BANK_INFO.email}</span>
        </div>
      </div>

      {/* Upload receipt */}
      <div>
        <p className="text-sm font-bold text-black mb-2">Comprobante de transferencia *</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />

        {receiptPreview ? (
          <div className="flex items-center gap-3">
            <img src={receiptPreview} alt="Comprobante" className="h-24 w-auto rounded-lg border border-gray-200 object-cover" />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500">{receiptFile?.name}</p>
              <button
                type="button"
                onClick={() => { handleFileChange(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="text-xs text-red-500 hover:underline text-left"
              >
                Cambiar imagen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-black transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-sm font-medium text-gray-500">Subir comprobante</span>
            <span className="text-xs text-gray-400">JPG, PNG o PDF</span>
          </button>
        )}
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <p className="text-xs text-amber-700">
          Tu orden sera creada una vez subas el comprobante. Verificaremos el pago y te notificaremos.
        </p>
      </div>

      {/* Actions */}
      <button
        type="button"
        onClick={() => receiptFile && onConfirm(receiptFile)}
        disabled={!receiptFile || isPending}
        className="w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Confirmar pedido'}
      </button>
      <button
        type="button"
        onClick={onBack}
        disabled={isPending}
        className="w-full text-gray-500 text-sm py-2 hover:text-black transition-colors"
      >
        Volver
      </button>
    </div>
  );
}
