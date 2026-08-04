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

const ROWS: [string, string, boolean?][] = [
  ['Banco', BANK_INFO.bank],
  ['Tipo de cuenta', BANK_INFO.accountType],
  ['Número de cuenta', BANK_INFO.accountNumber, true],
  ['Nombre', BANK_INFO.name],
  ['Cédula / RUC', BANK_INFO.cedula],
  ['Email', BANK_INFO.email],
];

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
      <h2 className="font-display text-2xl font-light text-text">Datos para transferencia</h2>

      <p className="font-body text-sm text-text-soft">
        Realiza la transferencia por <span className="text-text">${total.toFixed(2)}</span> a la siguiente cuenta y sube tu comprobante.
      </p>

      {/* Datos bancarios */}
      <div className="divide-y divide-border border border-border">
        {ROWS.map(([label, value, mono]) => (
          <div key={label} className="flex justify-between px-4 py-2.5">
            <span className="font-body text-xs uppercase tracking-[0.14em] text-text-muted">{label}</span>
            <span className={`text-sm text-text ${mono ? 'font-body tabular-nums' : 'font-body'}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Comprobante */}
      <div>
        <p className="eyebrow mb-3">Comprobante de transferencia *</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />

        {receiptPreview ? (
          <div className="flex items-center gap-3">
            <img src={receiptPreview} alt="Comprobante" className="h-24 w-auto border border-border object-cover" />
            <div className="flex flex-col gap-1">
              <p className="font-body text-xs text-text-muted">{receiptFile?.name}</p>
              <button
                type="button"
                onClick={() => { handleFileChange(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="text-left font-body text-xs text-text-soft transition-colors hover:text-accent"
              >
                Cambiar imagen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 border border-dashed border-border p-6 transition-colors hover:border-text"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-text-muted">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="font-body text-sm text-text-soft">Subir comprobante</span>
            <span className="font-body text-xs text-text-muted">JPG, PNG o PDF</span>
          </button>
        )}
      </div>

      {/* Aviso */}
      <div className="border-l-2 border-accent bg-bg-alt px-3 py-2.5">
        <p className="font-body text-xs text-text-soft">
          Tu orden será creada una vez subas el comprobante. Verificaremos el pago y te notificaremos.
        </p>
      </div>

      {/* Acciones */}
      <button
        type="button"
        onClick={() => receiptFile && onConfirm(receiptFile)}
        disabled={!receiptFile || isPending}
        className="mt-2 w-full bg-text py-4 font-body text-xs font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? <Loader size={18} color="#fff" className="mx-auto" /> : 'Confirmar pedido'}
      </button>
      <button
        type="button"
        onClick={onBack}
        disabled={isPending}
        className="w-full py-2 font-body text-sm text-text-muted transition-colors hover:text-text"
      >
        Volver
      </button>
    </div>
  );
}
