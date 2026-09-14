import { useState } from 'react';
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery';
import { useCartStore } from '@/app/store/cart/cartStore';
import { sonnerResponse } from '@/app/helpers/sonnerResponse';
import type { ProductVariant } from '@/app/types/global.types';

export function useProductDetailHook(productId: string) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProductByIdQuery(productId);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      sonnerResponse('Selecciona un color primero.', 'error');
      return;
    }
    const stock = Number(product.stock ?? 0);
    if (stock < quantity) {
      sonnerResponse('No hay suficiente stock disponible.', 'error');
      return;
    }
    addItem({
      productId: product.id,
      variantId: String(selectedVariant.id),
      name:      product.name,
      variationName: selectedVariant.name,
      image:     selectedVariant.images?.[0]?.url ?? product.image ?? '',
      price:     Number(selectedVariant.price),
      quantity,
      maxQty:    stock > 0 ? stock : undefined,
      stockAvailable: stock,
    });
    sonnerResponse(`${product.name} agregado al carrito.`, 'success');
    window.location.href = '/carrito';
  };

  return {
    product,
    isLoading,
    selectedVariant,
    setSelectedVariant,
    quantity,
    setQuantity,
    handleAddToCart,
  };
}
