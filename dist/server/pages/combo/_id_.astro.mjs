import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { A as AuthModal, $ as $$PublicLayout } from '../../chunks/PublicLayout_PVJkOzGl.mjs';
import { f as fetchComboById } from '../../chunks/combosQuery_CZi2MVhT.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { A as AppProviders, u as useAuthStore, f as formatCurrency } from '../../chunks/AppProviders_CurmEGpy.mjs';
import { u as useCartStore } from '../../chunks/Loader_Dg35OGdW.mjs';
export { renderers } from '../../renderers.mjs';

function ComboDetailContent({ combo }) {
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  useCartStore((s) => s.setDrawerOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showAuth, setShowAuth] = useState(false);
  const products = combo.comboProducts ?? [];
  const discount = combo.discount ?? 0;
  const hasDiscount = discount > 0;
  const actualPrice = hasDiscount ? combo.finalPrice - discount : combo.finalPrice;
  const discountPercent = hasDiscount ? Math.round(discount / combo.finalPrice * 100) : 0;
  const comboInStock = products.every((cp) => {
    const prod = cp.product;
    if (!prod) return false;
    const sealedStock = prod.stock ?? 0;
    const openMl = Number(prod.openBottleMlRemaining ?? 0);
    const totalMl = Number(prod.totalMl ?? 0);
    const availableMl = openMl + sealedStock * totalMl;
    if (cp.productVariation) {
      return availableMl >= Number(cp.productVariation.mlSize ?? 0) * cp.quantity;
    }
    return sealedStock >= cp.quantity;
  });
  const originalSum = products.reduce((sum, cp) => {
    const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0);
    return sum + price * cp.quantity;
  }, 0);
  const savings = originalSum > actualPrice ? originalSum - actualPrice : 0;
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    clearCart();
    const comboProducts = products.map((cp) => {
      const variant = cp.productVariation;
      if (variant) {
        return { productVariationId: parseInt(String(variant.id), 10), quantity: cp.quantity };
      }
      return { productId: parseInt(String(cp.productId), 10), quantity: cp.quantity };
    });
    addItem({
      productId: `combo-${combo.id}`,
      variantId: `combo-${combo.id}`,
      name: combo.name,
      image: combo.imageUrl || products[0]?.product?.image || "",
      ml: 0,
      price: actualPrice,
      quantity: 1,
      comboId: combo.id,
      comboProducts
    });
    window.location.href = "/checkout";
  };
  const handleWhatsapp = () => {
    const productList = products.map((cp) => cp.product?.name ?? "Producto").join(", ");
    const msg = `Hola, me interesa el combo "${combo.name}" (${productList}) por ${formatCurrency(actualPrice)}.`;
    window.open(`https://wa.me/593999707768?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-gray-100 rounded-2xl flex items-center justify-center aspect-square", children: combo.imageUrl ? /* @__PURE__ */ jsx("img", { src: combo.imageUrl, alt: combo.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs("div", { className: "text-gray-500 flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsxs("svg", { width: "64", height: "64", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "0.75", children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "7", width: "20", height: "14", rx: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M16 7V5a4 4 0 0 0-8 0v2" })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Sin imagen" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-accent uppercase tracking-wider", children: "Combo" }),
        /* @__PURE__ */ jsx("h1", { className: "font-heading text-2xl sm:text-3xl text-black font-bold leading-tight mt-1", children: combo.name })
      ] }),
      combo.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 leading-relaxed", children: combo.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "font-heading text-2xl font-bold text-black", children: formatCurrency(actualPrice) }),
        hasDiscount && /* @__PURE__ */ jsx("span", { className: "text-sm text-error line-through", children: formatCurrency(combo.finalPrice) }),
        discountPercent > 0 && /* @__PURE__ */ jsxs("span", { className: "bg-error text-white text-xs font-bold px-2 py-0.5 rounded", children: [
          "-",
          discountPercent,
          "%"
        ] })
      ] }),
      savings > 0 && /* @__PURE__ */ jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg px-3 py-2", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-700", children: [
        "Comprar por separado costaría ",
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: formatCurrency(originalSum) }),
        ". Ahorras ",
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: formatCurrency(savings) }),
        " con este combo."
      ] }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-heading text-xs font-bold text-gray-500 uppercase tracking-wider mb-3", children: "Productos incluidos" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: products.map((cp) => {
          const variant = cp.productVariation;
          const productPrice = Number(variant?.price ?? cp.product?.price ?? 0);
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-gray-200 p-2.5", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0", children: (() => {
              const img = cp.product?.imageUrl || cp.product?.image || cp.product?.images?.[0]?.url;
              return img ? /* @__PURE__ */ jsx("img", { src: img, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-500 text-xs", children: "N/A" });
            })() }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-black truncate", children: cp.product?.name ?? "Producto" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
                variant?.mlSize ? `${variant.mlSize}ml` : "",
                " ",
                variant?.isFullBottle ? "Botella" : variant?.mlSize ? "Decant" : "",
                cp.quantity > 1 && ` · ${cp.quantity}x`
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: formatCurrency(productPrice) })
          ] }, cp.id);
        }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: comboInStock ? handleBuyNow : void 0,
          disabled: !comboInStock,
          className: `w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${comboInStock ? "bg-accent text-white hover:bg-accent-hover" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`,
          children: comboInStock ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
            "Comprar combo — ",
            formatCurrency(actualPrice)
          ] }) : "Combo agotado"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleWhatsapp,
          className: "w-full border border-green-600 text-success py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors",
          children: [
            /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" }) }),
            "Consultar por WhatsApp"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "shrink-0 text-success", children: [
            /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
            /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: "Garantía" }),
            " · 7 días"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "shrink-0 text-accent-hover", children: [
            /* @__PURE__ */ jsx("rect", { x: "1", y: "3", width: "15", height: "13" }),
            /* @__PURE__ */ jsx("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }),
            /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "18.5", r: "2.5" }),
            /* @__PURE__ */ jsx("circle", { cx: "18.5", cy: "18.5", r: "2.5" })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: "Envío" }),
            " · desde $3"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AuthModal, { open: showAuth, onClose: () => setShowAuth(false) })
  ] });
}
function ComboDetailIsland({ combo }) {
  return /* @__PURE__ */ jsx(AppProviders, { children: /* @__PURE__ */ jsx(ComboDetailContent, { combo }) });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const combo = await fetchComboById(id);
  if (!combo) {
    return Astro2.redirect("/catalogo/combos");
  }
  return renderTemplate`${renderComponent($$result, "PublicLayout", $$PublicLayout, { "title": `${combo.name} \u2014 Combo \u2014 N\xF6nDecants` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white min-h-screen pt-10"> <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-10">  <nav class="mb-4 text-sm font-bold text-gray-500 flex items-center gap-2"> <a href="/" class="hover:text-black transition-colors">Inicio</a> <span class="text-gray-300">/</span> <a href="/catalogo/combos" class="hover:text-black transition-colors">Combos</a> <span class="text-gray-300">/</span> <span class="text-black">${combo.name}</span> </nav> ${renderComponent($$result2, "ComboDetailIsland", ComboDetailIsland, { "combo": combo, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/app/features/combos/components/ComboDetailIsland", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/combo/[id].astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/combo/[id].astro";
const $$url = "/combo/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
