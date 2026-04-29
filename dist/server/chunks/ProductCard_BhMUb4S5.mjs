import { useQuery } from '@tanstack/react-query';
import { a as axiosInstance, b as API_ENDPOINTS, f as formatCurrency } from './AppProviders_CurmEGpy.mjs';
import { b as MOCK_PRODUCTS } from './PublicLayout_PVJkOzGl.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

const extractMl = (v) => {
  if (v.measureValue) return Number(v.measureValue);
  if (v.ml) return Number(v.ml);
  const nameMatch = (v.name ?? "").match(/(\d+)\s*ml/i);
  if (nameMatch) return Number(nameMatch[1]);
  if (v.optionValues?.length) {
    for (const ov of v.optionValues) {
      const m = (ov.value ?? ov.displayName ?? "").match(/(\d+)\s*ml/i);
      if (m) return Number(m[1]);
    }
  }
  return 0;
};
const extractImages = (images) => {
  if (!images || !Array.isArray(images)) return [];
  return images.map((img) => typeof img === "string" ? img : img.url).filter(Boolean);
};
const mapProduct = (raw) => {
  const imageList = extractImages(raw.images);
  return {
    id: String(raw.id),
    name: raw.name ?? "",
    description: raw.description ?? "",
    image: imageList[0] || raw.image || raw.imageUrl || "",
    images: imageList.length > 0 ? imageList : [raw.imageUrl].filter(Boolean),
    variants: (raw.variations ?? raw.variants ?? []).map((v) => ({
      id: String(v.id),
      ml: v.mlSize ?? extractMl(v),
      price: Number(v.price ?? 0),
      mlSize: v.mlSize ?? extractMl(v),
      isFullBottle: v.isFullBottle ?? false,
      availableQuantity: v.availableQuantity ?? 0,
      images: extractImages(v.images)
    })),
    totalMl: raw.totalMl ?? 100,
    openBottleMlRemaining: raw.openBottleMlRemaining ?? 0,
    availableMl: raw.availableMl ?? 0,
    isActive: raw.isActive ?? true,
    bajoPedido: raw.bajoPedido ?? false,
    gender: raw.gender ?? void 0,
    timeOfDay: raw.timeOfDay ?? void 0,
    concentration: raw.concentration ?? void 0,
    projection: raw.projection ?? void 0,
    discount: raw.discount ? Number(raw.discount) : void 0,
    detailDescription: raw.detailDescription ?? void 0,
    benefits: (() => {
      if (!raw.benefits) return void 0;
      try {
        const parsed = JSON.parse(raw.benefits);
        return Array.isArray(parsed) ? parsed : void 0;
      } catch {
        return void 0;
      }
    })(),
    stock: raw.stock != null ? Number(raw.stock) : void 0,
    price: raw.price ? Number(raw.price) : void 0,
    createdAt: raw.createdAt ?? ""
  };
};
const applyMockFilters = (params) => {
  let filtered = [...MOCK_PRODUCTS];
  if (params.search) filtered = filtered.filter(
    (p) => p.name.toLowerCase().includes(params.search.toLowerCase())
  );
  if (params.inStock) filtered = filtered.filter((p) => p.variants.some((v) => v.availableQuantity > 0));
  if (params.bajoPedido !== void 0) filtered = filtered.filter((p) => p.bajoPedido === (String(params.bajoPedido) === "true"));
  if (params.hasDiscount) filtered = filtered.filter((p) => (p.discount ?? 0) > 0);
  if (params.minPrice !== void 0) {
    filtered = filtered.filter((p) => (p.price ?? 0) >= params.minPrice);
  }
  if (params.maxPrice !== void 0) {
    filtered = filtered.filter((p) => (p.price ?? 0) <= params.maxPrice);
  }
  if (params.gender) filtered = filtered.filter((p) => p.gender === params.gender);
  if (params.sortBy === "createdAt") {
    filtered.sort(
      (a, b) => params.sortOrder === "ASC" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (params.sortBy === "price") {
    filtered.sort(
      (a, b) => params.sortOrder === "ASC" ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0)
    );
  }
  const limit = params.limit ?? 12;
  const page = params.page ?? 1;
  const total = filtered.length;
  const start = (page - 1) * limit;
  return {
    content: filtered.slice(start, start + limit),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};
const fetchProducts = async (params) => {
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params });
    const responseData = data?.data ?? data;
    if (Array.isArray(responseData)) {
      return { content: responseData.map(mapProduct), pagination: { page: 1, limit: responseData.length, total: responseData.length, totalPages: 1 } };
    }
    if (responseData?.content) {
      return {
        ...responseData,
        content: responseData.content.map(mapProduct)
      };
    }
    if (responseData?.data && Array.isArray(responseData.data)) {
      return {
        content: responseData.data.map(mapProduct),
        pagination: {
          page: responseData.page ?? 1,
          limit: responseData.limit ?? 20,
          total: responseData.total ?? 0,
          totalPages: responseData.totalPages ?? 1
        }
      };
    }
    return responseData || applyMockFilters(params);
  } catch (error) {
    console.error("[fetchProducts] API error — falling back to mock filters:", error?.response?.status, error?.response?.data ?? error?.message);
    return applyMockFilters(params);
  }
};
const fetchProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`${API_ENDPOINTS.PRODUCT}/${id}`);
    const productData = data?.data ?? data;
    if (productData && typeof productData === "object") {
      return mapProduct(productData);
    }
    return mapProduct(data);
  } catch (error) {
    console.warn(`Error fetching product ${id}:`, error);
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? MOCK_PRODUCTS[0];
  }
};
const useProductsQuery = ({ queryParams = {}, enabled = true } = {}) => useQuery({
  queryKey: ["products", queryParams],
  queryFn: () => fetchProducts(queryParams),
  enabled
});

const CONCENTRATION_SHORT = {
  EAU_DE_PARFUM: "EDP",
  EAU_DE_TOILETTE: "EDT",
  ELIXIR_DE_PARFUM: "Elixir",
  EAU_DE_COLOGNE: "EDC",
  BODY_MIST: "Body Mist",
  PARFUM_EXTRAIT: "Extrait"
};
const GENDER_LABELS = {
  HOMBRE: "Hombre",
  MUJER: "Mujer",
  UNISEX: "Unisex"
};
const TIME_LABELS = {
  DIA: "Día",
  NOCHE: "Noche"
};
function ProductCard({ product }) {
  const productImages = (product.images ?? []).map((img) => typeof img === "string" ? img : img.url).filter(Boolean);
  const productImage = productImages[0] || product.image || product.imageUrl;
  const hoverImage = productImages[1];
  const variants = product.variants ?? [];
  const prices = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price ?? 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price ?? 0;
  const sealedStock = product.stock ?? 0;
  const openMl = product.openBottleMlRemaining ?? 0;
  const totalMl = product.totalMl ?? 0;
  const availableMl = openMl + sealedStock * totalMl;
  const hasFullBottleStock = sealedStock > 0;
  const hasDecantStock = availableMl > 0;
  const hasStock = hasFullBottleStock || hasDecantStock;
  const totalStock = sealedStock;
  const discount = product.discount ?? 0;
  const hasDiscount = discount > 0;
  const discountedMin = hasDiscount ? minPrice * (1 - discount / 100) : minPrice;
  const discountedMax = hasDiscount ? maxPrice * (1 - discount / 100) : maxPrice;
  const priceLabel = discountedMin === discountedMax ? formatCurrency(discountedMin) : `Desde ${formatCurrency(discountedMin)}`;
  const originalLabel = minPrice === maxPrice ? formatCurrency(minPrice) : `Desde ${formatCurrency(minPrice)}`;
  const productUrl = `/producto/${product.id}`;
  return /* @__PURE__ */ jsxs("a", { href: productUrl, className: "group/card relative flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden w-full hover:shadow-md transition-shadow", children: [
    hasDiscount && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-3 z-10 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", children: [
      "-",
      discount,
      "%"
    ] }),
    hasStock && totalStock <= 5 && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full", children: [
      "Quedan ",
      totalStock
    ] }),
    /* @__PURE__ */ jsx("div", { className: "block overflow-hidden relative", children: productImage ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: productImage,
          alt: product.name,
          className: `w-full aspect-square object-cover transition-all duration-500 ${hoverImage ? "group-hover/card:opacity-0" : "group-hover/card:scale-105"}`,
          loading: "lazy"
        }
      ),
      hoverImage && /* @__PURE__ */ jsx(
        "img",
        {
          src: hoverImage,
          alt: product.name,
          className: "absolute inset-0 w-full aspect-square object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500",
          loading: "lazy"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400", children: /* @__PURE__ */ jsxs("svg", { width: "48", height: "48", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "0.75", children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
      /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1.5 p-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-heading font-semibold text-base text-black leading-snug line-clamp-1 tracking-wide", children: product.name }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
        product.gender && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500", children: GENDER_LABELS[product.gender] ?? product.gender }),
        product.timeOfDay && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500", children: TIME_LABELS[product.timeOfDay] ?? product.timeOfDay }),
        product.concentration && /* @__PURE__ */ jsx("span", { className: "text-xs font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500", children: CONCENTRATION_SHORT[product.concentration] ?? product.concentration })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mt-0.5", children: hasDiscount ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "font-body text-xs text-gray-500 line-through", children: originalLabel }),
        /* @__PURE__ */ jsx("span", { className: "font-heading text-sm font-bold text-error", children: priceLabel })
      ] }) : /* @__PURE__ */ jsx("span", { className: "font-body text-xs text-gray-500", children: priceLabel }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pb-4 mt-auto", children: /* @__PURE__ */ jsx(
      "span",
      {
        className: `flex items-center justify-center w-full py-2.5 font-heading text-xs font-bold uppercase tracking-wider transition-colors rounded-full ${hasStock ? "bg-black text-white group-hover/card:bg-neutral-800" : "bg-gray-100 text-gray-500"}`,
        children: hasStock ? hasDecantStock && !hasFullBottleStock ? "DECANTS DISPONIBLES" : "VER PRODUCTO" : "SIN STOCK"
      }
    ) })
  ] });
}

export { ProductCard as P, fetchProducts as a, fetchProductById as f, mapProduct as m, useProductsQuery as u };
