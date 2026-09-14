import AppProviders from '@/app/providers/AppProviders';
import { useProductDetailHook } from './hooks/useProductDetailHook';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import Loader from '@/app/components/Loader';

interface ProductDetailProps {
  productId: string;
}

function ProductDetailContent({ productId }: ProductDetailProps) {
  const {
    product,
    isLoading,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    handleAddToCart,
  } = useProductDetailHook(productId);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-32 flex items-center justify-center">
        <Loader size={45} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-[--color-text-muted]">Producto no encontrado.</p>
        <a href="/catalogo" className="mt-4 inline-block text-[--color-accent] text-sm hover:underline">
          Volver al catálogo
        </a>
      </div>
    );
  }

  const images = (product.images?.length ? product.images : [product.image].filter(Boolean)) as string[];

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-40 md:px-14 md:pb-24">
      {/* Breadcrumb — mono editorial (ref. PDF ficha) */}
      <nav className="flex items-center gap-3 py-6 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">
        <a href="/catalogo" className="transition-colors hover:text-text">
          Tienda
        </a>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[1.05fr_1fr] md:gap-20">
        <ProductImages images={images} name={product.name} />
        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onVariantSelect={setSelectedVariant}
          onQtyChange={setQuantity}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  return (
    <AppProviders>
      <ProductDetailContent productId={productId} />
    </AppProviders>
  );
}
