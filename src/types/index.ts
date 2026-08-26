export type SuperCategoryId =
  | "iluminacion-led-neon"
  | "herramientas-maquinarias"
  | "instrumentos-medicion"
  | "tubos-lamparas-especiales"
  | "fuentes-poder-soldadura"
  | "pilas-baterias-cargadores"
  | "seguridad-control-electrico"
  | "electronica-miscelaneos";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SuperCategory {
  id: SuperCategoryId;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  description: string;
  image: string;
  subcategories: SubCategory[];
  color: string;
}

export interface TierPrice {
  minQty: number;
  maxQty?: number;
  price: number;
  label: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: SuperCategoryId;
  subcategory: string;
  brand: string;
  images: string[];
  price: number; // precio oferta
  originalPrice?: number; // precio normal
  discount?: number; // % descuento
  rating: number;
  reviewCount: number;
  stock: number;
  soldCount: number;
  isFlashSale?: boolean;
  isB2B?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  secCertified: boolean;
  warranty: string;
  specs: Record<string, string>;
  tierPrices?: TierPrice[];
  shippingWeight: number;
  freeShippingThreshold?: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CategoryNavItem {
  id: string;
  label: string;
  href: string;
  hot?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ShippingOption {
  region: string;
  cost: number;
  estimatedDays: string;
}

export type PaymentMethod = "webpay" | "mercadopago" | "transferencia";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  region: string;
  comuna: string;
  customer: {
    nombre: string;
    email: string;
    rut: string;
    telefono: string;
    direccion: string;
  };
  estimatedDays: string;
  createdAt: string;
}
