// Fuente única de verdad para todos los endpoints de la API NönDecants
// Backend: http://localhost:3030/api
export const API_ENDPOINTS = {
  // ── Auth ────────────────────────────────────────
  LOGIN:                      '/auth/login',               // POST - public
  REGISTER:                   '/auth/register',            // POST - public (sends verification email)
  LOGOUT:                     '/auth/logout',              // Not implemented in backend yet
  RENEW_TOKEN:                '/auth/refresh-token',       // Not implemented in backend yet
  VERIFY_EMAIL:               '/auth/verify-email',        // GET - public (?token=)
  RESEND_VERIFICATION:        '/auth/resend-verification', // POST - public
  FORGOT_PASSWORD:            '/auth/forgot-password',     // POST - public
  RESET_PASSWORD:             '/auth/reset-password',      // POST - public
  CHANGE_PASSWORD:            '/auth/change-password',     // Not implemented yet
  GOOGLE_AUTH:                '/auth/google',              // POST - public (Google ID token)

  // ── Users ───────────────────────────────────────
  USER_ME:                    '/users/me',             // Not implemented - use GET /users/:id
  USERS:                      '/users',                // GET all (admin), POST create (public)
  USER:                       '/users',                // + /:id GET/PATCH/DELETE

  // ── Banners ─────────────────────────────────────
  BANNERS:                    '/banners',              // Not in backend

  // ── Categories ──────────────────────────────────
  CATEGORIES:                 '/categories',           // GET all (public), POST create (admin)
  CATEGORY:                   '/categories',           // + /:id GET/PATCH/DELETE
  CATEGORY_PRODUCTS:          '/categories',           // + /:id/products GET (public)
  SUBCATEGORIES:              '/categories/subcategories',
  SUBCATEGORY_PRODUCTS:       '/categories/subcategories', // + /:id/products GET (public)

  // ── Products ────────────────────────────────────
  PRODUCTS:                   '/products',             // GET all (public), POST create (admin)
  PRODUCT:                    '/products',             // + /:id GET/PATCH/DELETE
  PRODUCTS_WITH_DECANTS:      '/products/with-decants', // GET all with decants (public)
  PRODUCT_DECANTS:            '/products',             // + /:id/decants GET (public)
  PRODUCT_VARIATIONS:         '/product-variations',   // GET/POST

  // ── Product Options (admin) ─────────────────────
  PRODUCT_OPTIONS:            '/product-options',      // GET all (public), POST/PATCH/DELETE (admin)
  PRODUCT_OPTION_VALUES:      '/product-options/values', // GET/POST/PATCH/DELETE

  // ── Cart ────────────────────────────────────────
  CART:                       '/cart',                 // GET (auth), DELETE (clear)
  CART_ITEMS:                 '/cart/items',           // POST add, PATCH update, DELETE remove

  // ── Orders ──────────────────────────────────────
  ORDERS:                     '/orders',               // GET all (auth: clients see own, admins see all)
  ORDER:                      '/orders',               // + /:id GET/PATCH/DELETE
  ORDERS_FROM_CART:           '/orders/from-cart',     // POST create from cart (auth)

  // ── Inventory ───────────────────────────────────
  INVENTORY:                  '/inventory',            // Not in backend
  INVENTORY_ITEM:             '/inventory',            // Not in backend

  // ── Delivery ────────────────────────────────────
  DELIVERY_METHODS:           '/delivery-methods',     // Not in backend

  // ── Payments (Payphone) ──────────────────────────
  CREATE_TRANSACTION:         '/payments/create-transaction',    // Not in backend
  VERIFY_PAYMENT:             '/payments/verify',                // Not in backend
  UPDATE_TRANSACTION_STATUS:  '/payments/update-status',         // Not in backend

  // ── Dashboard (admin) ────────────────────────────
  DASHBOARD_STATS:            '/dashboard/stats',      // Not in backend
  DASHBOARD_SALES:            '/dashboard/sales',      // Not in backend

  // ── Clients (admin) ─────────────────────────────
  CLIENTS:                    '/clients',              // Not in backend - use /users
  CLIENT:                     '/clients',              // Not in backend

  // ── Finances (admin) ────────────────────────────
  FINANCES_SUMMARY:           '/finances/summary',     // Not in backend
  FINANCES_EXPENSES:          '/finances/expenses',    // Not in backend
};
