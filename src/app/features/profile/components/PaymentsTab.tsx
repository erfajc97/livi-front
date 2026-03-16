import { MOCK_PAYMENTS } from '../data';

export default function PaymentsTab() {
  const payments = MOCK_PAYMENTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Pagos</h2>
        <p className="text-sm text-gray-400 mt-0.5">Historial de tus compras realizadas</p>
      </div>

      {/* Payments list */}
      <div className="rounded-xl border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-black text-sm">Historial de compras</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {payments.map((payment, i) => (
            <div key={`${payment.id}-${i}`} className="flex items-center gap-4 px-5 py-4">
              <img
                src={payment.image}
                alt={payment.name}
                className="h-14 w-11 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-black text-sm">{payment.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  Método: {payment.method}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-black text-sm">
                  ${(payment.amount / 1000).toFixed(3)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{payment.date}</p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
