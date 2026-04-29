import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead } from '../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$AnnouncementBar } from '../chunks/AnnouncementBar_D7JCKYgK.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { u as useAuthStore, a as axiosInstance, b as API_ENDPOINTS, f as formatCurrency, A as AppProviders } from '../chunks/AppProviders_CurmEGpy.mjs';
import { useMemo, useState, useEffect, useRef } from 'react';
import { u as useCartStore, s as sonnerResponse, L as Loader } from '../chunks/Loader_Dg35OGdW.mjs';
export { renderers } from '../renderers.mjs';

const GYE_CITIES = ["guayaquil", "durán", "duran", "samborondón", "samborondon"];
const STATIC_DELIVERY_OPTIONS = [
  { id: "entrega-personal", method: "ENTREGA_PERSONAL", label: "Entrega personal Plaza Tía (La Joya)", cost: 0, cities: ["guayaquil"] },
  { id: "retiro-piwu", method: "RETIRO_PIWU", label: "Retiro en Piwu Market (Urdesa)", cost: 2, cities: ["guayaquil"] },
  { id: "servientrega-gye", method: "SERVIENTREGA_GYE", label: "Servientrega (Guayaquil - Durán - Samborondón)", cost: 3, cities: GYE_CITIES },
  { id: "servientrega-nacional", method: "SERVIENTREGA_NACIONAL", label: "Servientrega Nacional (Provincias)", cost: 7, cities: [] }
];
function useDeliveryMethodsHook(city) {
  const methods = useMemo(() => {
    if (!city) return STATIC_DELIVERY_OPTIONS;
    const normalizedCity = city.toLowerCase().trim();
    return STATIC_DELIVERY_OPTIONS.filter((opt) => {
      if (opt.method === "SERVIENTREGA_NACIONAL") {
        return !GYE_CITIES.includes(normalizedCity);
      }
      return opt.cities.includes(normalizedCity);
    });
  }, [city]);
  return { methods, isLoading: false };
}

const PAYPHONE_SURCHARGE_RATE = 0.06;
const calcPayphoneSurcharge = (subtotal) => {
  return parseFloat((subtotal * PAYPHONE_SURCHARGE_RATE).toFixed(2));
};

const PREFS_KEY = "nondecants-checkout-prefs";
function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function savePrefs(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
  }
}
function buildInitialCustomer() {
  const prefs = loadPrefs();
  const user = useAuthStore.getState().user;
  return {
    name: user?.firstName ?? user?.name ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    cedula: user?.cedula ?? "",
    reference: user?.reference ?? "",
    phone: user?.phone ?? prefs.phone ?? "",
    province: user?.province ?? "",
    city: user?.city ?? prefs.city ?? "",
    address: user?.address ?? prefs.address ?? ""
  };
}
function getInitialDeliveryMethod(prefs) {
  const user = useAuthStore.getState().user;
  const method = user?.preferredDeliveryMethod ?? prefs.deliveryMethod;
  return method ?? null;
}
function useCheckoutHook() {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState(buildInitialCustomer);
  const savedPrefs = loadPrefs();
  const [deliveryMethod, setDeliveryMethod] = useState(getInitialDeliveryMethod(savedPrefs));
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!isAuth) return;
    axiosInstance.get(API_ENDPOINTS.USER_ME).then(({ data }) => {
      const u = data?.data ?? data;
      const prefs = loadPrefs();
      setCustomer((prev) => ({
        name: prev.name || u.firstName || "",
        lastName: prev.lastName || u.lastName || "",
        email: prev.email || u.email || "",
        cedula: prev.cedula || u.cedula || "",
        reference: prev.reference || u.reference || "",
        phone: prev.phone || u.phone || prefs.phone || "",
        province: prev.province || u.province || "",
        city: prev.city || u.city || prefs.city || "",
        address: prev.address || u.address || prefs.address || ""
      }));
      if (u.preferredDeliveryMethod && !deliveryMethod) {
        setDeliveryMethod(u.preferredDeliveryMethod);
      }
    }).catch(() => {
    });
  }, []);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.total());
  const productSubtotal = items.filter((i) => i.comboId == null).reduce((acc, i) => acc + i.price * i.quantity, 0);
  const { methods: deliveryOptions, isLoading: deliveryLoading } = useDeliveryMethodsHook(customer.city);
  const deliveryCost = couponFreeShipping ? 0 : deliveryMethod ? deliveryOptions.find((m) => m.method === deliveryMethod)?.cost ?? 0 : 0;
  const afterDiscount = Math.max(0, subtotal - couponDiscount);
  const isPayphone = paymentMethod === "PAYPHONE";
  const payphoneSurcharge = isPayphone ? calcPayphoneSurcharge(afterDiscount + deliveryCost) : 0;
  const total = afterDiscount + deliveryCost + payphoneSurcharge;
  const clearCart = useCartStore((s) => s.clearCart);
  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (field === "city") setDeliveryMethod(null);
  };
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.COUPONS_VALIDATE, {
        code: couponCode,
        orderAmount: productSubtotal
      });
      const result = data?.data ?? data;
      if (result.valid) {
        setCouponDiscount(result.discount);
        setCouponFreeShipping(result.freeShipping);
        setCouponApplied(true);
        setCouponMessage(result.message);
        sonnerResponse(result.message, "success");
      } else {
        setCouponDiscount(0);
        setCouponFreeShipping(false);
        setCouponApplied(false);
        setCouponMessage(result.message);
        sonnerResponse(result.message, "error");
      }
    } catch {
      setCouponMessage("Error al validar el cupón");
      sonnerResponse("Error al validar el cupón", "error");
    } finally {
      setCouponLoading(false);
    }
  };
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponFreeShipping(false);
    setCouponApplied(false);
    setCouponMessage("");
  };
  const handleNextStep = () => {
    if (!customer.name || !customer.email || !customer.phone || !customer.city) {
      sonnerResponse("Completa los datos de contacto.", "error");
      return;
    }
    if (!deliveryMethod) {
      sonnerResponse("Selecciona un método de entrega.", "error");
      return;
    }
    if (items.length === 0) {
      sonnerResponse("Tu carrito está vacío.", "error");
      return;
    }
    savePrefs({
      phone: customer.phone,
      city: customer.city,
      address: customer.address,
      deliveryMethod: deliveryMethod ?? void 0
    });
    setStep(2);
  };
  const handleSubmit = async () => {
    if (!paymentMethod) {
      sonnerResponse("Selecciona un método de pago.", "error");
      return;
    }
    setIsPending(true);
    try {
      const isAuth = useAuthStore.getState().isAuthenticated;
      if (isAuth) {
        axiosInstance.patch(API_ENDPOINTS.USER_ME, {
          firstName: customer.name,
          lastName: customer.lastName,
          phone: customer.phone,
          cedula: customer.cedula,
          province: customer.province,
          city: customer.city,
          address: customer.address,
          reference: customer.reference,
          preferredDeliveryMethod: deliveryMethod
        }).catch(() => {
        });
      }
      const orderItems = items.flatMap((item) => {
        if (item.comboProducts && item.comboProducts.length > 0) {
          const comboPrice = item.price;
          const numProducts = item.comboProducts.length;
          const pricePerItem = Math.round(comboPrice / numProducts * 100) / 100;
          const lastItemPrice = Math.round((comboPrice - pricePerItem * (numProducts - 1)) * 100) / 100;
          return item.comboProducts.map((cp, idx) => {
            const override = idx === numProducts - 1 ? lastItemPrice : pricePerItem;
            if (cp.productVariationId) {
              return { productVariationId: cp.productVariationId, quantity: cp.quantity * item.quantity, priceOverride: override };
            }
            if (cp.productId) {
              return { productId: cp.productId, quantity: cp.quantity * item.quantity, priceOverride: override };
            }
            return { productId: parseInt(item.productId, 10), quantity: cp.quantity * item.quantity, priceOverride: override };
          });
        }
        const isFullBottle = item.variantId.startsWith("full-");
        if (isFullBottle) {
          return { productId: parseInt(item.productId, 10), quantity: item.quantity };
        }
        return { productVariationId: parseInt(item.variantId, 10), quantity: item.quantity };
      });
      const payload = {
        items: orderItems,
        paymentMethod,
        customerName: `${customer.name} ${customer.lastName}`.trim(),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingCity: customer.city,
        shippingAddress: customer.address,
        deliveryMethod,
        deliveryCost,
        couponCode: couponApplied ? couponCode : void 0,
        couponDiscount: couponApplied ? couponDiscount : void 0,
        notes: [
          customer.cedula && `Cédula: ${customer.cedula}`,
          customer.reference && `Ref: ${customer.reference}`,
          customer.province && `Provincia: ${customer.province}`
        ].filter(Boolean).join(" | ") || void 0
      };
      const { data } = await axiosInstance.post(API_ENDPOINTS.CREATE_TRANSACTION, payload);
      const result = data?.data ?? data;
      if (result.paymentUrl) {
        clearCart();
        window.location.href = result.paymentUrl;
      } else {
        clearCart();
        const orderId = result.order?.id || result.order?.orderNumber;
        sonnerResponse("¡Orden creada exitosamente!", "success");
        window.location.href = `/orden/confirmacion?orderId=${orderId}&method=TRANSFERENCIA`;
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Error al crear la orden";
      sonnerResponse(typeof msg === "string" ? msg : JSON.stringify(msg), "error");
    } finally {
      setIsPending(false);
    }
  };
  const handleTransferSubmit = async (receiptFile) => {
    setIsPending(true);
    try {
      const isAuth = useAuthStore.getState().isAuthenticated;
      if (isAuth) {
        axiosInstance.patch(API_ENDPOINTS.USER_ME, {
          firstName: customer.name,
          lastName: customer.lastName,
          phone: customer.phone,
          cedula: customer.cedula,
          province: customer.province,
          city: customer.city,
          address: customer.address,
          reference: customer.reference,
          preferredDeliveryMethod: deliveryMethod
        }).catch(() => {
        });
      }
      const orderItems = items.flatMap((item) => {
        if (item.comboProducts && item.comboProducts.length > 0) {
          const comboPrice = item.price;
          const numProducts = item.comboProducts.length;
          const pricePerItem = Math.round(comboPrice / numProducts * 100) / 100;
          const lastItemPrice = Math.round((comboPrice - pricePerItem * (numProducts - 1)) * 100) / 100;
          return item.comboProducts.map((cp, idx) => {
            const override = idx === numProducts - 1 ? lastItemPrice : pricePerItem;
            if (cp.productVariationId) {
              return { productVariationId: cp.productVariationId, quantity: cp.quantity * item.quantity, priceOverride: override };
            }
            if (cp.productId) {
              return { productId: cp.productId, quantity: cp.quantity * item.quantity, priceOverride: override };
            }
            return { productId: parseInt(item.productId, 10), quantity: cp.quantity * item.quantity, priceOverride: override };
          });
        }
        const isFullBottle = item.variantId.startsWith("full-");
        if (isFullBottle) {
          return { productId: parseInt(item.productId, 10), quantity: item.quantity };
        }
        return { productVariationId: parseInt(item.variantId, 10), quantity: item.quantity };
      });
      const payload = {
        items: orderItems,
        paymentMethod: "TRANSFERENCIA",
        customerName: `${customer.name} ${customer.lastName}`.trim(),
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingCity: customer.city,
        shippingAddress: customer.address,
        deliveryMethod,
        deliveryCost,
        couponCode: couponApplied ? couponCode : void 0,
        couponDiscount: couponApplied ? couponDiscount : void 0,
        notes: [
          customer.cedula && `Cédula: ${customer.cedula}`,
          customer.reference && `Ref: ${customer.reference}`,
          customer.province && `Provincia: ${customer.province}`
        ].filter(Boolean).join(" | ") || void 0
      };
      const { data } = await axiosInstance.post(API_ENDPOINTS.CREATE_TRANSACTION, payload);
      const result = data?.data ?? data;
      const orderId = result.order?.id;
      if (orderId && receiptFile) {
        const fd = new FormData();
        fd.append("receipt", receiptFile);
        await axiosInstance.post(`/payments/${orderId}/upload-receipt`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      clearCart();
      sonnerResponse("¡Orden creada con comprobante!", "success");
      window.location.href = `/orden/confirmacion?orderId=${orderId}&method=TRANSFERENCIA`;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Error al crear la orden";
      sonnerResponse(typeof msg === "string" ? msg : JSON.stringify(msg), "error");
    } finally {
      setIsPending(false);
    }
  };
  return {
    step,
    setStep,
    customer,
    deliveryMethod,
    paymentMethod,
    deliveryOptions,
    deliveryLoading,
    subtotal,
    deliveryCost,
    payphoneSurcharge,
    isPayphone,
    total,
    items,
    isPending,
    couponCode,
    couponDiscount,
    couponFreeShipping,
    couponApplied,
    couponLoading,
    couponMessage,
    setCouponCode,
    handleApplyCoupon,
    handleRemoveCoupon,
    handleCustomerChange,
    setDeliveryMethod,
    setPaymentMethod,
    handleNextStep,
    handleSubmit,
    handleTransferSubmit
  };
}

function CheckoutStepTabs({ step, setStep }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-8 border-b border-gray-200 pb-0 font-bold text-sm text-gray-400", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setStep(1),
        className: `pb-3 -mb-px transition-colors ${step === 1 ? "text-black border-b-2 border-black" : "hover:text-text-muted"}`,
        children: "1. Información de envío"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setStep(2),
        className: `pb-3 -mb-px transition-colors ${step === 2 ? "text-black border-b-2 border-black" : "hover:text-text-muted"}`,
        children: "2. Método de pago"
      }
    )
  ] });
}

const INPUT_CLASS$1 = "w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-black focus:ring-0 focus:border-black transition-colors";
function ContactSection({ customer, onChange }) {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-black text-lg mb-4", children: "Contacto" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Nombres",
          value: customer.name,
          onChange: (e) => onChange("name", e.target.value),
          className: INPUT_CLASS$1,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Apellidos",
          value: customer.lastName,
          onChange: (e) => onChange("lastName", e.target.value),
          className: INPUT_CLASS$1,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          placeholder: "Correo electrónico",
          value: customer.email,
          onChange: (e) => onChange("email", e.target.value),
          className: INPUT_CLASS$1,
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Cédula",
          value: customer.cedula,
          onChange: (e) => onChange("cedula", e.target.value),
          className: INPUT_CLASS$1
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Referencia (Opcional)",
          value: customer.reference,
          onChange: (e) => onChange("reference", e.target.value),
          className: `${INPUT_CLASS$1} md:col-span-2`
        }
      )
    ] })
  ] });
}

const INPUT_CLASS = "w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-black focus:ring-0 focus:border-black transition-colors";
const SELECT_CLASS = "w-full bg-transparent border-0 border-b border-gray-300 px-0 py-2 text-sm text-gray-500 focus:ring-0 focus:border-black transition-colors cursor-pointer";
function AddressSection({ customer, onChange }) {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-black text-lg mb-4", children: "Información de dirección" }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Dirección",
          value: customer.address,
          onChange: (e) => onChange("address", e.target.value),
          className: `${INPUT_CLASS} md:col-span-2`,
          required: true
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: customer.province,
          onChange: (e) => onChange("province", e.target.value),
          className: SELECT_CLASS,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Provincia" }),
            /* @__PURE__ */ jsx("option", { value: "Guayas", children: "Guayas" }),
            /* @__PURE__ */ jsx("option", { value: "Pichincha", children: "Pichincha" }),
            /* @__PURE__ */ jsx("option", { value: "Azuay", children: "Azuay" }),
            /* @__PURE__ */ jsx("option", { value: "Manabi", children: "Manabí" }),
            /* @__PURE__ */ jsx("option", { value: "El Oro", children: "El Oro" }),
            /* @__PURE__ */ jsx("option", { value: "Los Rios", children: "Los Ríos" }),
            /* @__PURE__ */ jsx("option", { value: "Tungurahua", children: "Tungurahua" }),
            /* @__PURE__ */ jsx("option", { value: "Imbabura", children: "Imbabura" }),
            /* @__PURE__ */ jsx("option", { value: "Santo Domingo", children: "Santo Domingo" }),
            /* @__PURE__ */ jsx("option", { value: "Santa Elena", children: "Santa Elena" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "select",
        {
          value: customer.city,
          onChange: (e) => onChange("city", e.target.value),
          className: SELECT_CLASS,
          required: true,
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Ciudad" }),
            /* @__PURE__ */ jsx("option", { value: "Guayaquil", children: "Guayaquil" }),
            /* @__PURE__ */ jsx("option", { value: "Duran", children: "Durán" }),
            /* @__PURE__ */ jsx("option", { value: "Samborondon", children: "Samborondón" }),
            /* @__PURE__ */ jsx("option", { value: "Quito", children: "Quito" }),
            /* @__PURE__ */ jsx("option", { value: "Cuenca", children: "Cuenca" }),
            /* @__PURE__ */ jsx("option", { value: "Machala", children: "Machala" }),
            /* @__PURE__ */ jsx("option", { value: "Manta", children: "Manta" }),
            /* @__PURE__ */ jsx("option", { value: "Ambato", children: "Ambato" }),
            /* @__PURE__ */ jsx("option", { value: "Ibarra", children: "Ibarra" }),
            /* @__PURE__ */ jsx("option", { value: "Santo Domingo", children: "Santo Domingo" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "tel",
          placeholder: "Número telefónico",
          value: customer.phone,
          onChange: (e) => onChange("phone", e.target.value),
          className: `${INPUT_CLASS} md:col-span-2`,
          required: true
        }
      )
    ] })
  ] });
}

function DeliverySection({ options, isLoading, selected, onSelect }) {
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-black text-lg mb-4", children: "Método de envío" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col divide-y divide-gray-200", children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 py-3", children: "Cargando opciones..." }) : options.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 py-3", children: "Selecciona una ciudad primero para ver las opciones disponibles." }) : options.map((opt) => /* @__PURE__ */ jsxs("label", { onClick: () => onSelect(opt.method), className: "flex items-center justify-between cursor-pointer group py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === opt.method ? "border-black" : "border-gray-300 group-hover:border-black"}`, children: selected === opt.method && /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 bg-black rounded-full" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-black", children: opt.label })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-black", children: opt.cost === 0 ? "Grátis" : formatCurrency(opt.cost) })
    ] }, opt.id)) })
  ] });
}

const METHODS = [
  {
    key: "PAYPHONE",
    label: "Tarjeta débito o crédito",
    icon: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-blue-800 font-bold text-xs italic border border-border rounded px-1.5 py-0.5", children: "VISA" }),
      /* @__PURE__ */ jsx("div", { className: "w-5 h-5 rounded-full border border-border overflow-hidden flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-2.5 h-5 bg-blue-500 skew-x-12" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-orange-500 font-bold text-xs border border-border rounded px-1.5 py-0.5", children: "DISCOVER" })
    ] })
  },
  {
    key: "TRANSFERENCIA",
    label: "Transferencia bancaria / Depósito",
    icon: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "text-text-muted", children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M2 10h20" })
    ] })
  }
];
function PaymentSection({ selected, onSelect }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-black text-lg mb-1", children: "Método de pago" }),
    selected === "PAYPHONE" && /* @__PURE__ */ jsx("p", { className: "text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2", children: "Se aplica un recargo del 6% por procesamiento con tarjeta." }),
    selected === "TRANSFERENCIA" && /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2", children: "Después de confirmar, podrás subir tu comprobante de transferencia." }),
    METHODS.map((m) => /* @__PURE__ */ jsx(
      "label",
      {
        onClick: () => onSelect(m.key),
        className: `flex items-center justify-between cursor-pointer border rounded-xl px-5 py-4 transition-colors ${selected === m.key ? "border-black bg-gray-50" : "border-gray-200 hover:border-black"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected === m.key ? "border-black" : "border-gray-300"}`, children: selected === m.key && /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 bg-black rounded-full" }) }),
          m.icon,
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-black", children: m.label })
        ] })
      },
      m.key
    ))
  ] });
}

const BANK_INFO = {
  bank: "Banco Pichincha",
  accountType: "Cuenta de Ahorros",
  accountNumber: "2206573833",
  name: "NönDecants",
  cedula: "0924538271",
  email: "nondecants@gmail.com"
};
function TransferBankInfoStep({ total, isPending, onConfirm, onBack }) {
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const fileRef = useRef(null);
  const handleFileChange = (file) => {
    setReceiptFile(file);
    if (receiptPreview) URL.revokeObjectURL(receiptPreview);
    setReceiptPreview(file ? URL.createObjectURL(file) : null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading font-bold text-black text-lg", children: "Datos para transferencia" }),
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
      "Realiza la transferencia por ",
      /* @__PURE__ */ jsxs("strong", { className: "text-black", children: [
        "$",
        total.toFixed(2)
      ] }),
      " a la siguiente cuenta y sube tu comprobante."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Banco" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: BANK_INFO.bank })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Tipo de cuenta" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: BANK_INFO.accountType })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Numero de cuenta" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900 font-mono", children: BANK_INFO.accountNumber })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Nombre" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: BANK_INFO.name })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Cedula / RUC" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: BANK_INFO.cedula })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-blue-700", children: "Email" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-blue-900", children: BANK_INFO.email })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-black mb-2", children: "Comprobante de transferencia *" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: fileRef,
          type: "file",
          accept: "image/*,.pdf",
          className: "hidden",
          onChange: (e) => handleFileChange(e.target.files?.[0] ?? null)
        }
      ),
      receiptPreview ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("img", { src: receiptPreview, alt: "Comprobante", className: "h-24 w-auto rounded-lg border border-gray-200 object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: receiptFile?.name }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                handleFileChange(null);
                if (fileRef.current) fileRef.current.value = "";
              },
              className: "text-xs text-red-500 hover:underline text-left",
              children: "Cambiar imagen"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => fileRef.current?.click(),
          className: "w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-black transition-colors",
          children: [
            /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "text-gray-400", children: [
              /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
              /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500", children: "Subir comprobante" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400", children: "JPG, PNG o PDF" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-3 py-2", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-700", children: "Tu orden sera creada una vez subas el comprobante. Verificaremos el pago y te notificaremos." }) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => receiptFile && onConfirm(receiptFile),
        disabled: !receiptFile || isPending,
        className: "w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        children: isPending ? /* @__PURE__ */ jsx(Loader, { size: 18, color: "#fff", className: "mx-auto" }) : "Confirmar pedido"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onBack,
        disabled: isPending,
        className: "w-full text-gray-500 text-sm py-2 hover:text-black transition-colors",
        children: "Volver"
      }
    )
  ] });
}

function CheckoutForm({
  step,
  setStep,
  customer,
  deliveryMethod,
  paymentMethod,
  deliveryOptions,
  deliveryLoading,
  isPending,
  total,
  handleCustomerChange,
  setDeliveryMethod,
  setPaymentMethod,
  handleNextStep,
  handleSubmit,
  handleTransferSubmit
}) {
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (step === 1) handleNextStep();
    else if (step === 2) {
      if (paymentMethod === "TRANSFERENCIA") {
        setStep(3);
      } else {
        handleSubmit();
      }
    }
  };
  return /* @__PURE__ */ jsxs("form", { className: "flex flex-col gap-6", onSubmit: onFormSubmit, children: [
    step !== 3 && /* @__PURE__ */ jsx(CheckoutStepTabs, { step, setStep }),
    step === 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(ContactSection, { customer, onChange: handleCustomerChange }),
      /* @__PURE__ */ jsx(AddressSection, { customer, onChange: handleCustomerChange }),
      /* @__PURE__ */ jsx(
        DeliverySection,
        {
          options: deliveryOptions,
          isLoading: deliveryLoading,
          selected: deliveryMethod,
          onSelect: setDeliveryMethod
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors",
          children: "Continuar"
        }
      )
    ] }),
    step === 2 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PaymentSection, { selected: paymentMethod, onSelect: setPaymentMethod }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: isPending || !paymentMethod,
          className: "w-full bg-black text-white font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          children: isPending ? /* @__PURE__ */ jsx(Loader, { size: 18, color: "#fff", className: "mx-auto" }) : paymentMethod === "TRANSFERENCIA" ? "Ver datos bancarios" : "Confirmar pedido"
        }
      )
    ] }),
    step === 3 && /* @__PURE__ */ jsx(
      TransferBankInfoStep,
      {
        total,
        isPending,
        onConfirm: handleTransferSubmit,
        onBack: () => setStep(2)
      }
    )
  ] });
}

function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryCost,
  total,
  couponCode = "",
  couponDiscount = 0,
  couponFreeShipping = false,
  couponApplied = false,
  couponLoading = false,
  couponMessage = "",
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  payphoneSurcharge = 0
}) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const hasNonComboItems = items.some((item) => item.comboId == null);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl font-bold text-black mb-6", children: "Tu pedido" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5 mb-8 flex-1", children: items.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "No hay productos en tu carrito." }) : items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-24 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0", children: /* @__PURE__ */ jsx("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-heading font-bold text-sm text-black leading-snug pr-4", children: item.name }),
          /* @__PURE__ */ jsx("button", { onClick: () => removeItem(item.variantId), className: "text-gray-400 hover:text-error transition-colors", "aria-label": "Eliminar producto", children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
            /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
          ] }) })
        ] }),
        item.comboId ? /* @__PURE__ */ jsxs("div", { className: "mt-1.5 border border-gray-200 rounded-md px-1.5 py-0.5 inline-block text-xs text-gray-500 font-bold uppercase tracking-wider", children: [
          "Combo · ",
          item.comboProducts?.length ?? 0,
          " productos"
        ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-1.5 border border-gray-200 rounded-md px-1.5 py-0.5 inline-block text-xs text-gray-500 font-bold uppercase tracking-wider", children: [
          item.ml,
          "ml ",
          item.ml >= 30 ? "Botella original" : "Decant"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-2", children: [
          item.comboId ? /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-black select-none", children: [
            "Cant: ",
            item.quantity
          ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0", children: [
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateQty(item.variantId, item.quantity - 1), className: "w-6 h-6 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black rounded-l text-xs", children: "−" }),
            /* @__PURE__ */ jsx("span", { className: "w-7 h-6 flex items-center justify-center border-y border-gray-200 text-sm font-bold text-black select-none", children: item.quantity }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateQty(item.variantId, item.quantity + 1), className: "w-6 h-6 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black rounded-r text-xs", children: "+" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-sm text-black", children: formatCurrency(item.price * item.quantity) })
        ] })
      ] })
    ] }, item.variantId)) }),
    onApplyCoupon && hasNonComboItems && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-wider text-gray-500 mb-2", children: "Cupón de descuento" }),
      couponApplied ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono font-bold text-success text-sm", children: couponCode }),
          /* @__PURE__ */ jsx("span", { className: "text-success text-xs ml-2", children: couponFreeShipping ? "Envío gratis" : `-${formatCurrency(couponDiscount)}` })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemoveCoupon,
            className: "text-error hover:text-error text-xs font-bold transition-colors",
            children: "Quitar"
          }
        )
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "coupon-code",
            type: "text",
            value: couponCode,
            onChange: (e) => onCouponCodeChange?.(e.target.value.toUpperCase()),
            placeholder: "Ej: VERANO2026",
            className: "flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono uppercase text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onApplyCoupon,
            disabled: couponLoading || !couponCode.trim(),
            className: "px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
            children: couponLoading ? "..." : "Aplicar"
          }
        )
      ] }),
      couponMessage && !couponApplied && /* @__PURE__ */ jsx("p", { className: "text-xs text-error mt-1.5", children: couponMessage })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 font-bold text-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gray-200" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-black", children: [
        /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { children: formatCurrency(subtotal) })
      ] }),
      couponDiscount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-success", children: [
        /* @__PURE__ */ jsx("span", { children: "Descuento cupón" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "-",
          formatCurrency(couponDiscount)
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-black", children: [
        /* @__PURE__ */ jsx("span", { children: couponFreeShipping ? "Envío (gratis)" : "Envío" }),
        /* @__PURE__ */ jsx("span", { children: couponFreeShipping ? formatCurrency(0) : formatCurrency(deliveryCost) })
      ] }),
      payphoneSurcharge > 0 && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-gray-500", children: [
        /* @__PURE__ */ jsx("span", { children: "Recargo Payphone (6%)" }),
        /* @__PURE__ */ jsx("span", { children: formatCurrency(payphoneSurcharge) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-px bg-gray-200 mt-2" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-black text-xl font-heading mt-2", children: [
        /* @__PURE__ */ jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsx("span", { children: formatCurrency(total) })
      ] })
    ] })
  ] });
}

function CheckoutContent() {
  const checkoutData = useCheckoutHook();
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 relative", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(CheckoutForm, { ...checkoutData }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block w-px bg-gray-200 shrink-0" }),
    /* @__PURE__ */ jsx("div", { className: "lg:w-[400px] shrink-0", children: /* @__PURE__ */ jsx(
      CheckoutOrderSummary,
      {
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        deliveryCost: checkoutData.deliveryCost,
        total: checkoutData.total,
        payphoneSurcharge: checkoutData.payphoneSurcharge,
        couponCode: checkoutData.couponCode,
        couponDiscount: checkoutData.couponDiscount,
        couponFreeShipping: checkoutData.couponFreeShipping,
        couponApplied: checkoutData.couponApplied,
        couponLoading: checkoutData.couponLoading,
        couponMessage: checkoutData.couponMessage,
        onCouponCodeChange: checkoutData.setCouponCode,
        onApplyCoupon: checkoutData.handleApplyCoupon,
        onRemoveCoupon: checkoutData.handleRemoveCoupon
      }
    ) })
  ] });
}
function Checkout() {
  return /* @__PURE__ */ jsx(AppProviders, { withToaster: true, children: /* @__PURE__ */ jsx(CheckoutContent, {}) });
}

const $$Astro = createAstro();
const prerender = false;
const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Checkout;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Checkout \u2014 N\xF6nDecants", "description": "Finaliza tu compra de forma segura" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="min-h-screen bg-[url('/footer.png')] bg-[--color-bg] bg-repeat bg-center flex flex-col pt-[40px]"> <div class="fixed top-0 left-0 right-0 z-50"> ${renderComponent($$result2, "AnnouncementBar", $$AnnouncementBar, {})} </div> <header class="w-full flex justify-center items-center py-4 mt-6"> <a href="/"> <h1 class="text-3xl md:text-4xl text-white font-heading tracking-wide">NönDecants</h1> </a> </header> <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">  ${renderComponent($$result2, "CheckoutIsland", Checkout, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/app/features/checkout/components/Checkout", "client:component-export": "default" })} </main> </div> ` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/checkout.astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
