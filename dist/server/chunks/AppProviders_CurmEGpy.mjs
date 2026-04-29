import axios from 'axios';
import CryptoJS from 'crypto-js';
import { create } from 'zustand';
import { jsx, jsxs } from 'react/jsx-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
};

const SECRET_KEY = "nondecants-dev-key-2026";
const isClient = typeof localStorage !== "undefined";
const secureStorage = {
  setItem(key, value) {
    if (!isClient) return;
    const encryptedKey = CryptoJS.SHA256(key + SECRET_KEY).toString();
    const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
    localStorage.setItem(encryptedKey, encryptedValue);
  },
  getItem(key) {
    if (!isClient) return null;
    const encryptedKey = CryptoJS.SHA256(key + SECRET_KEY).toString();
    const encryptedValue = localStorage.getItem(encryptedKey);
    if (!encryptedValue) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch {
      return null;
    }
  },
  removeItem(key) {
    if (!isClient) return;
    const encryptedKey = CryptoJS.SHA256(key + SECRET_KEY).toString();
    localStorage.removeItem(encryptedKey);
  },
  clear() {
    if (!isClient) return;
    localStorage.clear();
  }
};

const useAuthStore = create((set) => ({
  token: secureStorage.getItem("token"),
  refreshToken: secureStorage.getItem("refreshToken"),
  tokenExpiration: Number(secureStorage.getItem("tokenExpiration")) || null,
  user: null,
  isAuthenticated: !!secureStorage.getItem("token"),
  setToken: (token, refreshToken, expiration) => {
    secureStorage.setItem("token", token);
    secureStorage.setItem("refreshToken", refreshToken);
    secureStorage.setItem("tokenExpiration", String(expiration));
    set({ token, refreshToken, tokenExpiration: expiration, isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  removeToken: () => {
    secureStorage.removeItem("token");
    secureStorage.removeItem("refreshToken");
    secureStorage.removeItem("tokenExpiration");
    secureStorage.removeItem("keepSession");
    set({ token: null, refreshToken: null, tokenExpiration: null, user: null, isAuthenticated: false });
  }
}));

const API_ENDPOINTS = {
  // ── Auth ────────────────────────────────────────
  LOGIN: "/auth/login",
  // POST - public
  REGISTER: "/auth/register",
  // POST - public (sends verification email)
  LOGOUT: "/auth/logout",
  // Not implemented in backend yet
  RENEW_TOKEN: "/auth/refresh-token",
  // Not implemented in backend yet
  VERIFY_EMAIL: "/auth/verify-email",
  // GET - public (?token=)
  RESEND_VERIFICATION: "/auth/resend-verification",
  // POST - public
  FORGOT_PASSWORD: "/auth/forgot-password",
  // POST - public
  RESET_PASSWORD: "/auth/reset-password",
  // POST - public
  CHANGE_PASSWORD: "/auth/change-password",
  // Not implemented yet
  GOOGLE_AUTH: "/auth/google",
  // POST - public (Google ID token)
  // ── Users ───────────────────────────────────────
  USER_ME: "/users/me",
  // GET (auth) / PATCH (auth)
  USERS: "/users",
  // GET all (admin), POST create (public)
  USER: "/users",
  // + /:id GET/PATCH/DELETE
  // ── Banners ─────────────────────────────────────
  BANNERS: "/banners",
  BANNERS_VISIBLE: "/banners/visible",
  BANNERS_BY_CATEGORY: "/banners/category",
  // + /:categoryId
  BANNERS_BY_MARCA: "/banners/marca",
  // + /:marcaId
  // ── Blog ────────────────────────────────────────
  BLOG_PUBLISHED: "/blog/published",
  BLOG_BY_SLUG: "/blog/slug",
  // + /:slug
  // ── Coupons ─────────────────────────────────────
  COUPONS_VALIDATE: "/coupons/validate",
  // POST
  // ── Categories ──────────────────────────────────
  CATEGORIES: "/categories",
  // GET all (public), POST create (admin)
  CATEGORY: "/categories",
  // + /:id GET/PATCH/DELETE
  CATEGORY_PRODUCTS: "/categories",
  // + /:id/products GET (public)
  MARCAS: "/categories/marcas",
  MARCA_PRODUCTS: "/categories/marcas",
  // + /:id/products GET (public)
  // ── Landing Sections ────────────────────────────
  LANDING_SECTIONS: "/landing-sections",
  // GET all (admin), POST create (admin)
  LANDING_SECTIONS_ACTIVE: "/landing-sections/active",
  // GET active (public)
  LANDING_SECTION: "/landing-sections",
  // + /:id GET/PATCH/DELETE (admin)
  LANDING_SECTION_ADD_PRODUCT: "/landing-sections",
  // + /:id/products/:productId POST (admin)
  LANDING_SECTION_REMOVE_PRODUCT: "/landing-sections",
  // + /:id/products/:productId DELETE (admin)
  // ── Products ────────────────────────────────────
  PRODUCTS: "/products",
  // GET all (public), POST create (admin)
  PRODUCT: "/products",
  // + /:id GET/PATCH/DELETE
  PRODUCTS_WITH_DECANTS: "/products/with-decants",
  // GET all with decants (public)
  PRODUCT_DECANTS: "/products",
  // + /:id/decants GET (public)
  PRODUCT_VARIATIONS: "/product-variations",
  // GET/POST
  // ── Product Options (admin) ─────────────────────
  PRODUCT_OPTIONS: "/product-options",
  // GET all (public), POST/PATCH/DELETE (admin)
  PRODUCT_OPTION_VALUES: "/product-options/values",
  // GET/POST/PATCH/DELETE
  // ── Cart ────────────────────────────────────────
  CART: "/cart",
  // GET (auth), DELETE (clear)
  CART_ITEMS: "/cart/items",
  // POST add, PATCH update, DELETE remove
  // ── Orders ──────────────────────────────────────
  ORDERS: "/orders",
  // GET all (auth: clients see own, admins see all)
  ORDER: "/orders",
  // + /:id GET/PATCH/DELETE
  ORDERS_FROM_CART: "/orders/from-cart",
  // POST create from cart (auth)
  // ── Inventory ───────────────────────────────────
  INVENTORY: "/inventory",
  // Not in backend
  INVENTORY_ITEM: "/inventory",
  // Not in backend
  // ── Delivery ────────────────────────────────────
  DELIVERY_METHODS: "/delivery-methods",
  // Not in backend
  // ── Payments (Payphone) ──────────────────────────
  CREATE_TRANSACTION: "/payments/create-transaction",
  // POST (auth)
  VERIFY_PAYMENT: "/payments/verify",
  // GET (public, redirect callback)
  // ── Combos ───────────────────────────────────────
  COMBOS: "/combos",
  // GET all (admin)
  COMBOS_ACTIVE: "/combos/active",
  // GET active (public)
  // ── Newsletter ────────────────────────────────────
  NEWSLETTER_SUBSCRIBE: "/newsletter/subscribe",
  // POST - public
  // ── Settings ─────────────────────────────────────
  SETTINGS: "/settings",
  // GET all (public), PUT /:key (admin)
  // ── Dashboard (admin) ────────────────────────────
  DASHBOARD_STATS: "/dashboard/stats",
  // Not in backend
  DASHBOARD_SALES: "/dashboard/sales",
  // Not in backend
  // ── Clients (admin) ─────────────────────────────
  CLIENTS: "/clients",
  // Not in backend - use /users
  CLIENT: "/clients",
  // Not in backend
  // ── Finances (admin) ────────────────────────────
  FINANCES_SUMMARY: "/finances/summary",
  // Not in backend
  FINANCES_EXPENSES: "/finances/expenses"
  // Not in backend
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json"
  }
});
axiosInstance.interceptors.request.use((config) => {
  const token = secureStorage.getItem("token");
  const expiration = Number(secureStorage.getItem("tokenExpiration"));
  if (token && expiration) {
    if (Date.now() > expiration) {
      useAuthStore.getState().removeToken();
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = secureStorage.getItem("refreshToken");
    const keepSession = secureStorage.getItem("keepSession") === "true";
    if (error.response?.status === 502) {
      useAuthStore.getState().removeToken();
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && refreshToken && keepSession && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosInstance.post(API_ENDPOINTS.RENEW_TOKEN, {
          refresh_token: refreshToken
        });
        const newToken = data?.content?.access_token ?? data?.data?.access_token;
        const newRefreshToken = data?.content?.refresh_token ?? data?.data?.refresh_token;
        const decoded = JSON.parse(atob(newToken.split(".")[1]));
        const expiration = decoded.exp * 1e3;
        useAuthStore.getState().setToken(newToken, newRefreshToken, expiration);
        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch {
        useAuthStore.getState().removeToken();
        return Promise.reject(error);
      }
    }
    if (error.response?.status === 401) {
      useAuthStore.getState().removeToken();
    }
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

const GOOGLE_CLIENT_ID = "1082604572108-1ev4perc730lgn8hqv2blqdii2vut5h2.apps.googleusercontent.com";
function AppProviders({ children, withToaster = false }) {
  return /* @__PURE__ */ jsx(GoogleOAuthProvider, { clientId: GOOGLE_CLIENT_ID, children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    children,
    withToaster && /* @__PURE__ */ jsx(
      Toaster,
      {
        position: "top-right",
        toastOptions: {
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)"
          }
        }
      }
    )
  ] }) });
}

export { AppProviders as A, axiosInstance as a, API_ENDPOINTS as b, formatCurrency as f, secureStorage as s, useAuthStore as u };
