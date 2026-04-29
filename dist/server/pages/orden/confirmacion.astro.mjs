import { f as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$AnnouncementBar } from '../../chunks/AnnouncementBar_D7JCKYgK.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AppProviders, a as axiosInstance, b as API_ENDPOINTS, f as formatCurrency } from '../../chunks/AppProviders_CurmEGpy.mjs';
import 'sonner';
export { renderers } from '../../renderers.mjs';

function OrderConfirmationContent() {
  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  useRef(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("id") || params.get("paymentId");
    const clientTransactionId = params.get("clientTransactionId");
    const orderId = params.get("orderId");
    const method = params.get("method");
    console.log("[OrderConfirmation] URL params:", {
      paymentId,
      clientTransactionId,
      orderId,
      method,
      fullSearch: window.location.search
    });
    if (method === "TRANSFERENCIA" && orderId) {
      setStatus("transfer");
      setOrder({ orderNumber: String(orderId), total: 0, id: Number(orderId) || void 0 });
      return;
    }
    if (paymentId && clientTransactionId) {
      verifyPayment(paymentId, clientTransactionId);
    } else {
      setStatus("failed");
      setError(
        `No se encontraron datos de pago. Parámetros recibidos: ${window.location.search || "(ninguno)"}`
      );
    }
  }, []);
  const verifyPayment = async (paymentId, clientTransactionId) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.VERIFY_PAYMENT, {
        params: { id: paymentId, clientTransactionId }
      });
      const result = data?.data ?? data;
      if (result.paymentStatus === "paid" || result.approved) {
        setStatus("paid");
        setOrder(result.order);
      } else {
        setStatus("failed");
        setError(result.transactionStatusName || "Pago no aprobado");
      }
    } catch (err) {
      setStatus("failed");
      setError(err.response?.data?.message || "Error al verificar el pago");
    }
  };
  if (status === "loading") {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-3 border-border border-t-black rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm", children: "Verificando tu pago..." })
    ] });
  }
  if (status === "failed") {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center py-16 gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-error flex items-center justify-center", children: /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#ef4444", strokeWidth: "2.5", strokeLinecap: "round", children: [
        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }) }),
      /* @__PURE__ */ jsx("h1", { className: "font-heading text-2xl font-bold text-black", children: "Pago no completado" }),
      /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm max-w-sm", children: error }),
      /* @__PURE__ */ jsx("a", { href: "/checkout", className: "mt-4 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors", children: "Intentar de nuevo" })
    ] });
  }
  const isTransfer = status === "transfer";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center py-12 gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-full bg-green-100 flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
    /* @__PURE__ */ jsx("h1", { className: "font-heading text-2xl font-bold text-black", children: isTransfer ? "¡Orden registrada!" : "¡Pago exitoso!" }),
    order?.orderNumber && /* @__PURE__ */ jsxs("p", { className: "text-text-muted text-sm", children: [
      "Orden: ",
      /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: order.orderNumber })
    ] }),
    !isTransfer && order?.total ? /* @__PURE__ */ jsxs("p", { className: "text-text-muted text-sm", children: [
      "Total pagado: ",
      /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: formatCurrency(order.total) })
    ] }) : null,
    isTransfer && /* @__PURE__ */ jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2", children: [
        /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
        /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-green-800", children: "Comprobante enviado. Te notificaremos cuando confirmemos tu pago." })
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "text-text-muted text-xs max-w-sm mt-2", children: [
      "Te enviaremos los detalles a ",
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: order?.customerEmail || "tu correo" }),
      "."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md", children: [
      /* @__PURE__ */ jsx("a", { href: "/mi-cuenta", className: "flex-1 bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors text-center", children: "Ver mi pedido" }),
      /* @__PURE__ */ jsx("a", { href: "/catalogo", className: "flex-1 border border-border text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-surface-raised transition-colors text-center", children: "Seguir comprando" })
    ] })
  ] });
}
function OrderConfirmationIsland() {
  return /* @__PURE__ */ jsx(AppProviders, { children: /* @__PURE__ */ jsx(OrderConfirmationContent, {}) });
}

const prerender = false;
const $$Confirmacion = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Confirmaci\xF3n de orden \u2014 N\xF6nDecants" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-white flex flex-col pt-[40px]"> <div class="fixed top-0 left-0 right-0 z-50"> ${renderComponent($$result2, "AnnouncementBar", $$AnnouncementBar, {})} </div> <header class="w-full flex justify-center items-center py-4 mt-6"> <a href="/"> <img src="/logo.svg" alt="NönDecants" class="h-8"> </a> </header> <main class="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pb-16"> ${renderComponent($$result2, "OrderConfirmationIsland", OrderConfirmationIsland, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/app/features/order/components/OrderConfirmationIsland", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/orden/confirmacion.astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/orden/confirmacion.astro";
const $$url = "/orden/confirmacion";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmacion,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
