export interface ProductImage {
  id: string
  url: string
  alt: string
  thumbnail?: string
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  color?: string
  available: boolean
}

export interface SimpleDiscount {
  type: "percentage" | "fixed"
  value: number
  appliedAt: string
  reason: string
  campaignId: string
  validUntil?: string
}

export interface PriceOption {
  id: string
  type: "best_price" | "fast_shipping" | "installments"
  title: string
  merchantId?: string
  price: number
  originalPrice?: number
  description: string
  seller: {
    name: string
    displayName?: string
    isOfficial: boolean
    verified: boolean
    rating?: number
    salesCount?: string
    location?: string
  }
  discount?: SimpleDiscount
  installments?: {
    count: number
    amount: number
    interestFree: boolean
  }
  selected: boolean
}

export interface ShippingOption {
  type: "free" | "pickup"
  description: string
  estimatedDate: string
  additionalInfo?: string
}

export interface ProductReview {
  rating: number
  count: number
}

export interface RelatedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  freeShipping: boolean
}

export interface Product {
  id: string
  title: string
  description?: string
  condition: string
  category?: string
  salesCount: number
  basePrice: number
  images: ProductImage[]
  reviews?: ProductReview
  priceOptions: PriceOption[]
  colorVariants?: ProductVariant[]
  memoryVariants?: ProductVariant[]
  features?: string[]
  specifications?: Record<string, string>
  shipping?: ShippingOption[]
  stock?: {
    available: boolean
    quantity?: number
    fulfilledBy?: string
  }
  seller?: {
    name: string
    isOfficial: boolean
    verified: boolean
    salesCount?: string
    location?: string
    rating?: number
  }
  freeShippingPromo?: {
    threshold: number
    message?: string
  }
  paymentMethods?: {
    creditCard: boolean
    debitCard: boolean
    cash: boolean
    installments: boolean
    mercadoPago: boolean
  }
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
