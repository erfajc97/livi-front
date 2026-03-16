import { MOCK_TRACKING_STEPS, MOCK_TRACKING_ORDER } from '../data';

export default function TrackingTab() {
  const order = MOCK_TRACKING_ORDER;
  const steps = MOCK_TRACKING_STEPS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-black font-heading uppercase">Seguimiento del pedido</h2>
        <p className="text-sm text-gray-400 mt-0.5">Rastrea tu pedido en tiempo real</p>
      </div>

      {/* Product card */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4">
        <img
          src={order.image}
          alt={order.name}
          className="h-20 w-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-black text-sm">{order.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">Código: {order.id}</p>
          <span className="mt-1.5 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
            {order.status}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-black">{order.progress}% completado</span>
          <span className="text-gray-400">Entrega estimada: {order.estimatedDate}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${order.progress}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-black text-sm mb-4">Detalle del envío</h3>
        <div className="relative space-y-0">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            let dotClass = 'bg-gray-300';
            if (step.completed && step.active) dotClass = 'bg-accent ring-4 ring-accent/20';
            else if (step.completed) dotClass = 'bg-green-500';

            return (
              <div key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Vertical line */}
                {!isLast && (
                  <div className="absolute left-[7px] top-5 bottom-0 w-px bg-gray-200" />
                )}
                {/* Dot */}
                <div className={`relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full ${dotClass}`} />
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${step.active ? 'text-accent' : step.completed ? 'text-black' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
                  {step.date && (
                    <p className="text-[11px] text-gray-300 mt-0.5">{step.date}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-lg bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
          Contactar Soporte
        </button>
        <button className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-semibold text-black transition-colors hover:bg-gray-50">
          Reportar inconveniente
        </button>
      </div>
    </div>
  );
}
