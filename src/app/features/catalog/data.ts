import type { ProductType } from '@/app/types/global.types';

export const CATALOG_CATEGORIES: { value: ProductType | ''; label: string }[] = [
  { value: 'SELLADO',   label: 'Nicho' },
  { value: 'DECANT',    label: 'Diseñador' },
  { value: 'NONDECANT', label: 'Árabes' },
];

export const CATALOG_GENDERS = [
  { value: 'HOMBRES', label: 'Hombre' },
  { value: 'MUJERES', label: 'Mujer' },
  { value: 'UNISEX',  label: 'Unisex' },
];

export const CATALOG_TIME_OF_DAY = [
  { value: 'DIA',   label: 'Dia' },
  { value: 'NOCHE', label: 'Noche' },
];

export const CATALOG_CONCENTRATIONS = [
  { value: 'EAU_DE_PARFUM',    label: 'Eau de Parfum' },
  { value: 'EAU_DE_TOILETTE',  label: 'Eau de Toilette' },
  { value: 'ELIXIR_DE_PARFUM', label: 'Elixir de Parfum' },
  { value: 'EAU_DE_COLOGNE',   label: 'Eau de Cologne' },
  { value: 'BODY_MIST',        label: 'Body Mist' },
  { value: 'PARFUM_EXTRAIT',   label: 'Parfum / Extrait' },
];

export const CATALOG_PROJECTIONS = [
  { value: 'DISCRETA',  label: 'Discreta' },
  { value: 'MODERADA',  label: 'Moderada' },
  { value: 'ALTA',      label: 'Alta' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Recientes' },
  { value: 'price:asc',     label: 'Precio: Menor a Mayor' },
  { value: 'price:desc',    label: 'Precio: Mayor a Menor' },
  { value: 'name:asc',      label: 'Nombre: A-Z' },
  { value: 'name:desc',     label: 'Nombre: Z-A' },
];
