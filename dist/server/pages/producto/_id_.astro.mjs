import { f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, i as createAstro, j as renderComponent, k as Fragment$1 } from '../../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { A as AuthModal, $ as $$PublicLayout } from '../../chunks/PublicLayout_PVJkOzGl.mjs';
import { P as ProductCard, f as fetchProductById, a as fetchProducts } from '../../chunks/ProductCard_BhMUb4S5.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { u as useAuthStore, f as formatCurrency } from '../../chunks/AppProviders_CurmEGpy.mjs';
import { u as useCartStore, s as sonnerResponse } from '../../chunks/Loader_Dg35OGdW.mjs';
import 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
export { renderers } from '../../renderers.mjs';

function ProductPurchaseOptions({
  product,
  selectedVariant: externalVariant,
  onVariantChange
}) {
  const [selected, setSelected] = useState(() => {
    const stock = product.stock ?? 0;
    if (stock > 0) return { type: "full" };
    const openMl2 = product.openBottleMlRemaining ?? 0;
    const totalAvailMl = openMl2 + stock * (product.totalMl ?? 0);
    const firstAvailable = (product.variants ?? []).filter((v) => !v.isFullBottle && v.ml <= totalAvailMl).sort((a, b) => a.ml - b.ml)[0];
    if (firstAvailable) return { type: "decant", variant: firstAvailable };
    return { type: "full" };
  });
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (externalVariant === null) {
      setSelected({ type: "full" });
    }
  }, [externalVariant]);
  const handleSelectFull = () => {
    setSelected({ type: "full" });
    onVariantChange?.(null);
  };
  const handleSelectDecant = (v) => {
    setSelected({ type: "decant", variant: v });
    onVariantChange?.(v);
  };
  useEffect(() => {
    const unsub = useCartStore.subscribe((state) => {
      if (state._hasHydrated) setHasHydrated(true);
    });
    if (useCartStore.getState()._hasHydrated) setHasHydrated(true);
    return unsub;
  }, []);
  const fullBottlePrice = product.price ?? 0;
  const fullBottleStock = product.stock ?? 0;
  const fullBottleMl = product.totalMl ?? 0;
  const variants = product.variants ?? [];
  const decants = variants.filter((v) => !v.isFullBottle);
  const isFullSelected = selected.type === "full";
  const selectedDecant = selected.type === "decant" ? selected.variant : null;
  const currentPrice = isFullSelected ? fullBottlePrice : selectedDecant?.price ?? 0;
  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? currentPrice * (1 - discount / 100) : currentPrice;
  const openMl = product.openBottleMlRemaining ?? 0;
  const availableMl = openMl + fullBottleStock * fullBottleMl;
  const canBuyFullBottle = fullBottleStock > 0;
  const canBuyDecant = (ml) => availableMl >= ml;
  const inStock = isFullSelected ? canBuyFullBottle : selectedDecant ? canBuyDecant(selectedDecant.ml) : false;
  const hasAnyStock = canBuyFullBottle || availableMl > 0;
  const getCartItem = () => {
    if (isFullSelected) {
      return {
        productId: product.id,
        variantId: `full-${product.id}`,
        name: product.name,
        image: product.image || product.images?.[0],
        ml: fullBottleMl,
        price: hasDiscount ? discountedPrice : fullBottlePrice,
        quantity: 1
      };
    }
    if (selectedDecant) {
      return {
        productId: product.id,
        variantId: selectedDecant.id,
        name: product.name,
        image: selectedDecant.images?.[0] || product.image,
        ml: selectedDecant.ml,
        price: hasDiscount ? selectedDecant.price * (1 - discount / 100) : selectedDecant.price,
        quantity: 1
      };
    }
    return null;
  };
  const handleAddToCart = () => {
    if (!hasHydrated) {
      sonnerResponse("Cargando carrito...", "error");
      return;
    }
    const item = getCartItem();
    if (!item) {
      sonnerResponse("Selecciona una opcion.", "error");
      return;
    }
    if (!inStock) {
      sonnerResponse("No hay stock disponible.", "error");
      return;
    }
    addItem(item);
    sonnerResponse(`${product.name} agregado al carrito.`, "success");
    setDrawerOpen(true);
  };
  const handleFastPurchase = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    if (!hasHydrated) {
      sonnerResponse("Cargando carrito...", "error");
      return;
    }
    const item = getCartItem();
    if (!item) {
      sonnerResponse("Selecciona una opcion.", "error");
      return;
    }
    if (!inStock) {
      sonnerResponse("No hay stock disponible.", "error");
      return;
    }
    addItem(item);
    window.location.href = "/checkout";
  };
  const handleWhatsapp = () => {
    const ml = isFullSelected ? fullBottleMl : selectedDecant?.ml;
    const price = isFullSelected ? fullBottlePrice : selectedDecant?.price;
    if (!ml || !price) return;
    const msg = `Hola, quiero comprar el perfume ${product.name} de ${ml}ml por ${formatCurrency(price)}.`;
    window.open(`https://wa.me/593999707768?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const detailTags = [
    product.gender && { label: "Género", value: product.gender === "HOMBRE" ? "Hombre" : product.gender === "MUJER" ? "Mujer" : "Unisex" },
    product.concentration && { label: "Concentración", value: product.concentration.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace("De ", "de ") },
    product.timeOfDay && { label: "Hora", value: product.timeOfDay === "DIA" ? "Día" : "Noche" },
    product.projection && { label: "Proyección", value: product.projection === "DISCRETA" ? "Discreta" : product.projection === "MODERADA" ? "Moderada" : "Alta" }
  ].filter(Boolean);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "font-heading text-2xl sm:text-3xl text-black font-bold leading-none", children: product.name }),
        /* @__PURE__ */ jsx("button", { className: "shrink-0 text-gray-500 hover:text-error transition-colors mt-1", children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-0.5 text-xs", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx("span", { className: star <= 4 ? "text-accent-hover" : "text-gray-500", children: "★" }, star)) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "4.5 (212)" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "·" }),
        /* @__PURE__ */ jsx("span", { className: `text-sm font-bold ${hasAnyStock ? "text-success" : "text-error"}`, children: hasAnyStock ? "En stock" : "Agotado" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-heading text-xl font-bold text-black", children: formatCurrency(discountedPrice) }),
      hasDiscount && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 line-through", children: formatCurrency(currentPrice) }),
        /* @__PURE__ */ jsxs("span", { className: "bg-error text-white text-xs font-bold px-1.5 py-px rounded", children: [
          "-",
          discount,
          "%"
        ] })
      ] })
    ] }),
    product.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: product.description }),
    detailTags.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: detailTags.map((tag) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-gray-500 font-medium", children: [
        tag.label,
        ":"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-black font-semibold", children: tag.value })
    ] }, tag.label)) }),
    fullBottlePrice > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Botella Completa" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: canBuyFullBottle ? handleSelectFull : void 0,
          disabled: !canBuyFullBottle,
          className: `w-full py-2.5 px-4 rounded-lg border text-sm font-bold transition-all flex items-center justify-between ${!canBuyFullBottle ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60" : isFullSelected ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"}`,
          children: [
            /* @__PURE__ */ jsxs("span", { children: [
              fullBottleMl,
              "ml — ",
              canBuyFullBottle ? "Sellada" : "Agotada"
            ] }),
            /* @__PURE__ */ jsx("span", { className: isFullSelected ? "text-gray-300" : "text-gray-500", children: formatCurrency(fullBottlePrice) })
          ]
        }
      )
    ] }),
    decants.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-gray-500 uppercase tracking-wide mb-1.5", children: "Decants" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1.5", children: decants.map((v) => {
        const available = canBuyDecant(v.ml);
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: available ? () => handleSelectDecant(v) : void 0,
            disabled: !available,
            className: `py-2 px-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-between ${!available ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60" : selectedDecant?.id === v.id ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"}`,
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                v.ml,
                "ml"
              ] }),
              /* @__PURE__ */ jsx("span", { className: selectedDecant?.id === v.id ? "text-gray-300" : "text-gray-500", children: formatCurrency(v.price) })
            ]
          },
          v.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleFastPurchase,
        className: "w-full bg-accent text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors",
        children: [
          /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
          "Comprar ahora — Pago seguro"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleAddToCart,
          className: "flex-1 bg-black text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors",
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
              /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
              /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
              /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
            ] }),
            "Agregar al carrito"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleWhatsapp,
          className: "shrink-0 w-11 h-11 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors",
          title: "Consultar por WhatsApp",
          children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M11.996 2C6.474 2 2 6.474 2 11.996C2 13.921 2.548 15.717 3.511 17.25L2.146 22.18L7.204 20.852C8.683 21.688 10.297 22.158 11.996 22.158C17.518 22.158 22 17.684 22 12.162C22 6.64 17.518 2.166 11.996 2.166V2ZM17.152 16.315C16.94 16.91 16.1 17.433 15.441 17.545C14.945 17.625 14.284 17.682 11.838 16.669C8.91 15.452 7.027 12.441 6.884 12.253C6.741 12.064 5.72 10.71 5.72 9.31C5.72 7.91 6.442 7.238 6.741 6.93C6.983 6.681 7.404 6.551 7.82 6.551C7.962 6.551 8.089 6.558 8.199 6.564C8.484 6.577 8.627 6.602 8.814 7.051C9.05 7.618 9.623 9.022 9.693 9.172C9.764 9.322 9.851 9.531 9.742 9.742C9.643 9.941 9.551 10.035 9.408 10.203C9.266 10.372 9.13 10.493 8.979 10.672C8.847 10.832 8.694 10.992 8.865 11.282C9.036 11.571 9.625 12.532 10.489 13.303C11.603 14.298 12.51 14.611 12.83 14.743C13.151 14.875 13.34 14.856 13.568 14.613C13.797 14.368 14.441 13.621 14.713 13.313C14.985 13.003 15.241 13.041 15.526 13.144C15.811 13.248 17.324 13.996 17.625 14.145C17.925 14.295 18.125 14.369 18.196 14.494C18.267 14.618 18.267 15.308 17.965 15.939L17.152 16.315Z" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "shrink-0 text-success", children: [
          /* @__PURE__ */ jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
          /* @__PURE__ */ jsx("polyline", { points: "22 4 12 14.01 9 11.01" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: "Garantía" }),
          " · 7 días"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "shrink-0 text-accent-hover", children: [
          /* @__PURE__ */ jsx("rect", { x: "1", y: "3", width: "15", height: "13" }),
          /* @__PURE__ */ jsx("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }),
          /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "18.5", r: "2.5" }),
          /* @__PURE__ */ jsx("circle", { cx: "18.5", cy: "18.5", r: "2.5" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500 leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-black", children: "Envío" }),
          " · desde $3"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 font-medium", children: "Pago:" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-5 border border-gray-200 rounded px-1.5 flex items-center bg-orange-500 text-white font-bold text-xs italic", children: "PayPhone" }),
        /* @__PURE__ */ jsx("div", { className: "h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-blue-800 font-bold text-xs italic", children: "VISA" }) }),
        /* @__PURE__ */ jsx("div", { className: "h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-white", children: /* @__PURE__ */ jsx("span", { className: "text-error font-bold text-xs", children: "MC" }) }),
        /* @__PURE__ */ jsx("div", { className: "h-5 w-8 border border-gray-200 rounded flex items-center justify-center bg-blue-500", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: "AMEX" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AuthModal, { open: showAuth, onClose: () => setShowAuth(false) })
  ] });
}

function ProductGallery({
  images,
  name
}) {
  const src = images.length > 0 ? images[0] : "";
  if (!src) {
    return /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl", children: /* @__PURE__ */ jsxs("svg", { width: "64", height: "64", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "0.75", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
      /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "overflow-hidden bg-gray-100 rounded-2xl flex items-center justify-center aspect-square", children: /* @__PURE__ */ jsx(
    "img",
    {
      src,
      alt: name,
      className: "w-full h-full object-cover transition-all duration-300"
    }
  ) });
}
function ProductDetailIsland({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const galleryImages = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    const productImages = product.images?.length ? product.images : [product.image].filter(Boolean);
    return productImages;
  }, [selectedVariant, product.images, product.image]);
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-full overflow-hidden", children: /* @__PURE__ */ jsx(ProductGallery, { images: galleryImages, name: product.name }) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      ProductPurchaseOptions,
      {
        product,
        selectedVariant,
        onVariantChange: setSelectedVariant
      }
    ) })
  ] });
}

const $$Astro$2 = createAstro();
const $$ProductShippingTimeline = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ProductShippingTimeline;
  const apiBase = "http://localhost:4001/api";
  let deliveryOffset = 0;
  try {
    const res = await fetch(`${apiBase}/settings/delivery_days_offset`);
    if (res.ok) {
      const json = await res.json();
      deliveryOffset = Number(json?.data?.value ?? json?.value) || 0;
    }
  } catch {
    deliveryOffset = 0;
  }
  return renderTemplate`${maybeRenderHead()}<div class="border border-gray-200 rounded-lg p-4 mt-10"${addAttribute(deliveryOffset, "data-delivery-offset")}> <div class="flex items-start sm:items-center gap-2 text-xs sm:text-sm font-bold text-black"> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 mt-0.5 sm:mt-0"> <circle cx="12" cy="12" r="10"></circle> <polyline points="12 6 12 12 16 14"></polyline> </svg> <span>
Si hace hoy su pedido antes de las <strong>14:00 PM</strong>&nbsp; recibirá su pedido entre el <strong id="timeline-date-1">--/--/----</strong> al <strong id="timeline-date-2">--/--/----</strong> </span> </div> <div class="bg-gray-50 rounded-lg p-3 sm:p-5 mt-3 relative"> <!-- Line connector --> <div class="absolute top-[54px] sm:top-[62px] left-[18%] right-[18%] h-[2px] bg-black z-0"></div> <div class="flex justify-between items-start relative z-10"> <!-- Comprado --> <div class="flex flex-col items-center text-center"> <div class="bg-white rounded-full p-1.5 sm:p-2 mb-2"> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CDB989" stroke-width="2" stroke-linejoin="round" class="sm:w-7 sm:h-7"> <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path> <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline> <line x1="12" y1="22.08" x2="12" y2="12"></line> </svg> </div> <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full mb-2 shadow-[0_0_0_3px_white]"></div> <p class="font-bold text-black text-xs sm:text-sm">Comprado</p> <p class="text-gray-500 text-xs sm:text-xs mt-0.5" id="timeline-day-0">--</p> </div> <!-- Procesamiento --> <div class="flex flex-col items-center text-center"> <div class="bg-white rounded-full p-1.5 sm:p-2 mb-2"> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CDB989" stroke-width="2" stroke-linejoin="round" class="sm:w-7 sm:h-7"> <rect x="1" y="3" width="15" height="13"></rect> <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon> <circle cx="5.5" cy="18.5" r="2.5"></circle> <circle cx="18.5" cy="18.5" r="2.5"></circle> </svg> </div> <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full mb-2 shadow-[0_0_0_3px_white]"></div> <p class="font-bold text-black text-xs sm:text-sm">Procesamiento</p> <p class="text-gray-500 text-xs sm:text-xs mt-0.5" id="timeline-day-1">--</p> </div> <!-- Entregado --> <div class="flex flex-col items-center text-center"> <div class="bg-white rounded-full p-1.5 sm:p-2 mb-2"> <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CDB989" stroke-width="2" stroke-linejoin="round" class="sm:w-7 sm:h-7"> <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path> <circle cx="12" cy="10" r="3"></circle> </svg> </div> <div class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full mb-2 shadow-[0_0_0_3px_white]"></div> <p class="font-bold text-black text-xs sm:text-sm">Entregado</p> <p class="text-gray-500 text-xs sm:text-xs mt-0.5" id="timeline-day-2">--</p> </div> </div> </div> </div> `;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/app/features/product/components/ProductShippingTimeline.astro", void 0);

const $$Astro$1 = createAstro();
const $$ProductDescriptionBlock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProductDescriptionBlock;
  const { description, detailDescription, benefits } = Astro2.props;
  const displayDescription = detailDescription || description;
  const hasBenefits = benefits && benefits.length > 0;
  return renderTemplate`${maybeRenderHead()}<div class="mt-12"> <div class="border-b-4 border-border mb-6 flex"> <h2 class="font-heading font-bold text-xl text-black border-b-[3px] border-black pb-2 mb-[-3.5px] pr-4">
Detalles del producto
</h2> </div> <div class="space-y-4 text-text-muted text-sm leading-relaxed"> ${displayDescription && renderTemplate`<p>${displayDescription}</p>`} ${hasBenefits && renderTemplate`${renderComponent($$result, "Fragment", Fragment$1, {}, { "default": ($$result2) => renderTemplate` <h3 class="font-heading font-bold text-text-muted mt-6 mb-2">Ventajas del producto:</h3> <ul class="list-disc pl-5 space-y-1"> ${benefits.map((benefit) => renderTemplate`<li>${benefit}</li>`)} </ul> ` })}`} </div> </div>`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/app/features/product/components/ProductDescriptionBlock.astro", void 0);

const MOCK_REVIEWS = [
  {
    id: "1",
    rating: 5,
    date: "06/30/2026",
    author: "Manuel Velázquez",
    title: "Excelencia de perfume",
    text: "Me parece un producto super delicioso gracias a este perfume soy un fuckboy, tengo todo lo que siempre desee"
  },
  {
    id: "2",
    rating: 5,
    date: "06/30/2026",
    author: "Kelly Gutierrez",
    title: "Me encanta, para mi novio ideal",
    text: "Me parece un producto super delicioso gracias a este perfume soy un fuckboy, tengo todo lo que siempre desee"
  },
  {
    id: "3",
    rating: 4,
    date: "05/15/2026",
    author: "Juan Perez",
    title: "Muy buena fijación",
    text: "Excelente aroma, duradero y a buen precio. Lo recomiendo totalmente para salidas nocturnas."
  }
];

function CarouselArrow$1({ direction, onClick }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      "aria-label": direction === "left" ? "Anterior" : "Siguiente",
      className: "absolute z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent-hover shadow-lg hover:scale-105 transition-transform",
      style: direction === "left" ? { left: "-6px" } : { right: "-6px" },
      children: /* @__PURE__ */ jsx("div", { className: "bg-bg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: direction === "left" ? /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) : /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }) })
    }
  );
}
function ProductReviewsCarousel({ name }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-16", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-3xl font-bold uppercase mb-8 text-black", children: "Lo que nuestros clientes opinan" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center", children: [
      /* @__PURE__ */ jsx(CarouselArrow$1, { direction: "left", onClick: scrollPrev }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden w-full px-4 sm:px-6", ref: emblaRef, children: /* @__PURE__ */ jsx("div", { className: "flex gap-4 sm:gap-5", children: MOCK_REVIEWS.map((review) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "shrink-0 basis-[85%] sm:basis-full md:basis-[calc(50%-10px)] border border-accent-hover rounded-xl p-4 sm:p-6 bg-white",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: star <= review.rating ? "text-accent-hover" : "text-text-muted",
                  children: "★"
                },
                star
              )) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-text-muted", children: review.date })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg sm:text-xl font-bold text-black mb-1", children: name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-muted mb-4", children: review.author }),
            /* @__PURE__ */ jsx("h4", { className: "font-heading font-bold text-accent-hover italic mb-2", children: review.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-muted mb-5 line-clamp-3 leading-relaxed", children: review.text }),
            /* @__PURE__ */ jsx("button", { className: "text-sm text-text-muted hover:text-black transition-colors underline underline-offset-4", children: "Reseña completa" })
          ]
        },
        review.id
      )) }) }),
      /* @__PURE__ */ jsx(CarouselArrow$1, { direction: "right", onClick: scrollNext })
    ] })
  ] });
}

function CarouselArrow({ direction, onClick }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      "aria-label": direction === "left" ? "Anterior" : "Siguiente",
      className: "absolute z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-accent-hover shadow-lg hover:scale-105 transition-transform",
      style: direction === "left" ? { left: "-4px" } : { right: "-4px" },
      children: /* @__PURE__ */ jsx("div", { className: "bg-bg w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-white", children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: direction === "left" ? /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) : /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }) })
    }
  );
}
function ExploreCategoriesCarousel({ products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  if (products.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mt-16 mb-10", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-3xl font-bold uppercase text-black mb-8 px-2 sm:px-12", children: "Explora nuestras categorias" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center", children: [
      /* @__PURE__ */ jsx(CarouselArrow, { direction: "left", onClick: scrollPrev }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden w-full px-2 sm:px-12", ref: emblaRef, children: /* @__PURE__ */ jsx("div", { className: "flex", children: products.map((product) => /* @__PURE__ */ jsx("div", { className: "px-2 shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/4", children: /* @__PURE__ */ jsx(ProductCard, { product }) }, product.id)) }) }),
      /* @__PURE__ */ jsx(CarouselArrow, { direction: "right", onClick: scrollNext })
    ] })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const product = await fetchProductById(id);
  if (!product) {
    return Astro2.redirect("/404");
  }
  const allProductsRes = await fetchProducts({ limit: 12 });
  const relatedProducts = allProductsRes.content.filter((p) => p.id !== product.id);
  return renderTemplate`${renderComponent($$result, "PublicLayout", $$PublicLayout, { "title": `${product.name} \u2014 N\xF6nDecants` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white min-h-screen pt-10"> <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-10">  <nav class="mb-4 text-sm font-bold text-gray-500 flex items-center gap-2"> <a href="/" class="hover:text-black transition-colors">Inicio</a> <span class="text-gray-300">/</span> <a href="/catalogo" class="hover:text-black transition-colors">Perfumes</a> <span class="text-gray-300">/</span> <span class="text-black">${product.name}</span> </nav> ${renderComponent($$result2, "ProductDetailIsland", ProductDetailIsland, { "product": product, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/app/features/product/components/ProductDetailIsland", "client:component-export": "default" })} ${renderComponent($$result2, "ProductShippingTimeline", $$ProductShippingTimeline, {})} ${renderComponent($$result2, "ProductDescriptionBlock", $$ProductDescriptionBlock, { "description": product.description, "detailDescription": product.detailDescription, "benefits": product.benefits })} ${renderComponent($$result2, "ProductReviewsCarousel", ProductReviewsCarousel, { "name": product.name, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/app/features/product/components/ProductReviewsCarousel", "client:component-export": "default" })} </div>  <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-20"> ${renderComponent($$result2, "ExploreCategoriesCarousel", ExploreCategoriesCarousel, { "products": relatedProducts, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/app/features/product/components/ExploreCategoriesCarousel", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/producto/[id].astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/producto/[id].astro";
const $$url = "/producto/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
