import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro } from '../../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { $ as $$PublicLayout } from '../../chunks/PublicLayout_PVJkOzGl.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { a as axiosInstance, b as API_ENDPOINTS, f as formatCurrency, A as AppProviders } from '../../chunks/AppProviders_CurmEGpy.mjs';
import { useQuery } from '@tanstack/react-query';
import { O as ORDER_STATUS_CONFIG } from '../../chunks/data_BEE7tX-D.mjs';
import { L as Loader } from '../../chunks/Loader_Dg35OGdW.mjs';
export { renderers } from '../../renderers.mjs';

const orderService = {
  getById: async (id) => {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.ORDER}/${id}`);
    return data?.content ?? data;
  },
  getMyOrders: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.MY_ORDERS);
    return data?.content ?? data ?? [];
  }
};

function useOrderDetailHook(orderId) {
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getById(orderId),
    enabled: !!orderId,
    retry: 1
  });
  return { order, isLoading, isError };
}

function OrderStatusBadge({ status }) {
  const config = ORDER_STATUS_CONFIG[status];
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-block px-3 py-1 text-xs font-heading tracking-wider uppercase border ${config.color}`,
      style: { borderRadius: "var(--radius-sm)" },
      children: config.label
    }
  );
}

function OrderTracking({ trackingCode }) {
  if (!trackingCode) {
    return /* @__PURE__ */ jsx("div", { className: "bg-white border border-gray-200 p-5", style: { borderRadius: "var(--radius-md)" }, children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "El código de seguimiento estará disponible cuando el pedido sea despachado." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 p-5", style: { borderRadius: "var(--radius-md)" }, children: [
    /* @__PURE__ */ jsx("p", { className: "font-heading text-xs uppercase tracking-wider text-gray-500 mb-2", children: "Seguimiento Servientrega" }),
    /* @__PURE__ */ jsx("p", { className: "font-heading text-lg text-[--color-accent]", children: trackingCode }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: `https://www.servientrega.com.ec/rastreo/?guia=${trackingCode}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-3 inline-block text-xs text-[--color-accent] hover:underline",
        children: "Rastrear en Servientrega →"
      }
    )
  ] });
}

const PAYMENT_LABELS = {
  PAYPHONE: "Payphone (tarjeta)",
  TRANSFERENCIA: "Transferencia bancaria",
  EFECTIVO: "Efectivo"
};
const DELIVERY_LABELS = {
  RETIRO: "Retiro en tienda (Daule)",
  SERVIENTREGA_GYE: "Servientrega GYE/Sam/Durán",
  SERVIENTREGA_NACIONAL: "Servientrega Nacional"
};
function OrderConfirmation({ order }) {
  return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full bg-[--color-success]/20 border border-[--color-success]/40 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "text-[--color-success]", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl text-[--color-text] uppercase tracking-wider", children: "¡Orden confirmada!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-[--color-text-muted] text-sm mt-2", children: [
        "Pedido ",
        /* @__PURE__ */ jsxs("span", { className: "text-[--color-accent] font-medium", children: [
          "#",
          order.id.slice(-8).toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(OrderStatusBadge, { status: order.status }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[--color-surface] border border-[--color-border] p-5", style: { borderRadius: "var(--radius-md)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-heading text-sm uppercase tracking-wider text-[--color-text-muted] mb-4", children: "Productos" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: order.items.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-[--color-text-muted]", children: [
          item.name,
          " · ",
          item.ml,
          "ml × ",
          item.quantity
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[--color-text]", children: formatCurrency(item.price * item.quantity) })
      ] }, i)) }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-[--color-border] mt-4 pt-4 space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text-muted]", children: "Subtotal" }),
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text]", children: formatCurrency(order.subtotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text-muted]", children: "Envío" }),
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text]", children: order.deliveryCost === 0 ? "GRATIS" : formatCurrency(order.deliveryCost) })
        ] }),
        order.payphoneSurcharge > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text-muted]", children: "Recargo Payphone (6%)" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[--color-accent]", children: [
            "+",
            formatCurrency(order.payphoneSurcharge)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between font-heading text-base pt-2 border-t border-[--color-border]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[--color-text]", children: "Total" }),
          /* @__PURE__ */ jsx("span", { className: "text-[--color-accent]", children: formatCurrency(order.total) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[--color-surface] border border-[--color-border] p-5 space-y-3", style: { borderRadius: "var(--radius-md)" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "font-heading text-sm uppercase tracking-wider text-[--color-text-muted]", children: "Información de entrega" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted] text-xs mb-0.5", children: "Cliente" }),
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text]", children: order.customerName })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted] text-xs mb-0.5", children: "Email" }),
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text]", children: order.customerEmail })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted] text-xs mb-0.5", children: "Ciudad" }),
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text]", children: order.city })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted] text-xs mb-0.5", children: "Método de entrega" }),
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text]", children: DELIVERY_LABELS[order.deliveryMethod] ?? order.deliveryMethod })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted] text-xs mb-0.5", children: "Método de pago" }),
          /* @__PURE__ */ jsx("p", { className: "text-[--color-text]", children: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(OrderTracking, { trackingCode: order.trackingCode }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: /* @__PURE__ */ jsx(
      "a",
      {
        href: "/catalogo",
        className: "px-8 py-3 border border-[--color-border-accent] text-[--color-accent] font-heading text-sm uppercase tracking-wider text-center hover:bg-[--color-surface] transition-colors",
        style: { borderRadius: "var(--radius-sm)" },
        children: "Seguir comprando"
      }
    ) })
  ] });
}

function OrderDetailContent({ orderId }) {
  const { order, isLoading, isError } = useOrderDetailHook(orderId);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-4 py-32 flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader, { size: 45, color: "var(--color-accent)" }) });
  }
  if (isError || !order) {
    return /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[--color-text-muted]", children: "No se encontró la orden." }),
      /* @__PURE__ */ jsx("a", { href: "/", className: "mt-4 inline-block text-[--color-accent] text-sm hover:underline", children: "Volver al inicio" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-12", children: /* @__PURE__ */ jsx(OrderConfirmation, { order }) });
}
function OrderDetail({ orderId }) {
  return /* @__PURE__ */ jsx(AppProviders, { children: /* @__PURE__ */ jsx(OrderDetailContent, { orderId }) });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "PublicLayout", $$PublicLayout, { "title": "Orden confirmada \u2014 N\xF6nDecants", "description": "Detalle y seguimiento de tu orden en N\xF6nDecants." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "OrderDetail", OrderDetail, { "orderId": id, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/app/features/order/OrderDetail", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/orden/[id].astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/orden/[id].astro";
const $$url = "/orden/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
