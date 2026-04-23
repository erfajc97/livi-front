export default function PaymentMethodIcons() {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <div className="h-9 border border-border rounded-md px-2.5 flex items-center justify-center bg-orange-500 text-white font-bold text-[10px] italic">
        ACEPTAMOS PayPhone
      </div>
      <div className="h-9 w-12 border border-border rounded-md flex items-center justify-center bg-surface-raised">
        <span className="text-blue-800 font-bold text-[11px] italic">VISA</span>
      </div>
      <div className="h-9 w-12 border border-border rounded-md flex items-center justify-center bg-surface-raised">
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center">
          <div className="w-2.5 h-6 bg-blue-500 skew-x-12" />
        </div>
      </div>
      <div className="h-9 w-14 border border-border rounded-md flex items-center justify-center bg-surface-raised">
        <span className="text-orange-500 font-bold text-[9px]">DISCOVER</span>
      </div>
      <div className="h-9 border border-border rounded-md px-2.5 flex items-center justify-center bg-surface-raised">
        <span className="text-gray-600 font-bold text-[9px]">Transferencia Bancaria</span>
      </div>
    </div>
  );
}
