"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Truck, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useProduct } from "./hooks/useProduct"
import { ProductAPI } from "./services/api"
import { ProductSkeleton } from "./components/loading-skeleton"
import { NotFoundPage } from "./components/not-found-page"

interface ProductPageProps {
  productId: string
}

interface PriceOption {
  id: string
  title?: string
  price: number
  originalPrice?: number
  discount?: {
    reason: string
    type: string
    value: number
  }
  installments?: {
    count: number
    amount: number
    interestFree?: boolean
  }
  description?: string
  seller?: {
    verified?: boolean
  }
}

export default function Component({ productId }: ProductPageProps) {
  const router = useRouter()
  const { product, relatedProducts, loading, error } = useProduct(productId)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedMemory, setSelectedMemory] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedPriceOption, setSelectedPriceOption] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Update selected variants when product loads
  useEffect(() => {
    if (product) {
      // Set default color (first available)
      const defaultColor = product.colorVariants?.find((v) => v.available)?.id || ""
      setSelectedColor(defaultColor)

      // Set default memory (first available)
      const defaultMemory = product.memoryVariants?.find((v) => v.available)?.id || ""
      setSelectedMemory(defaultMemory)

      // Set default price option (selected one or first one)
      const defaultPrice = product.priceOptions?.find((p) => p.selected)?.id || product.priceOptions?.[0]?.id || ""
      setSelectedPriceOption(defaultPrice)

      // Track product view
      ProductAPI.updateProductView(productId)
    }
  }, [product, productId])

  // Function to navigate to another product
  const navigateToProduct = (newProductId: string) => {
    router.push(`/product/${newProductId}`)
  }

  const handleAddToCart = async () => {
    if (!product) return

    const selectedVariant = `${selectedColor}-${selectedMemory}`
    const result = await ProductAPI.addToCart(productId, selectedVariant, quantity)

    if (result.success) {
      console.log("Added to cart successfully")
      // Here you could show a toast notification
    } else {
      console.error("Failed to add to cart:", result.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff]">
        <div className="bg-[#ffe600] h-16"></div>
        <div className="bg-[#ededed] h-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ProductSkeleton />
        </div>
      </div>
    )
  }

  // Show 404 page if product not found
  if (error || !product) {
    return (
      <NotFoundPage
        title="Parece que este producto no existe"
        message={error || "El producto que buscas no está disponible o fue removido."}
        showBackButton={true}
      />
    )
  }

  // Function to calculate discount percentage from price options
  const calculateDiscount = (priceOption: PriceOption) => {
    if (!priceOption.originalPrice || !priceOption.discount) return null

    const discountAmount = priceOption.originalPrice - priceOption.price
    return Math.round((discountAmount / priceOption.originalPrice) * 100)
  }

  // Update the pricing section to use the new structure with better error handling
  const selectedPriceOptionData = product.priceOptions?.find((p) => p.id === selectedPriceOption)

  // If selected option doesn't have a price, fall back to the first option with a price
  const validPriceOption = selectedPriceOptionData?.price
    ? selectedPriceOptionData
    : product.priceOptions?.find((p) => p.price && p.price > 0)

  const selectedColorData = product.colorVariants?.find((c) => c.id === selectedColor)
  const selectedMemoryData = product.memoryVariants?.find((m) => m.id === selectedMemory)

  const discount = validPriceOption ? calculateDiscount(validPriceOption) : null

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <header className="bg-[#ffe600] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo - Always visible, shrinks on mobile */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/mercado-libre-challenge-logo.png"
              alt="Mercado Libre Challenge"
              width={180}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </div>

          {/* Search Bar - Priority 1: Takes available space */}
          <div className="flex-1 max-w-2xl min-w-0 mx-2 sm:mx-4 lg:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-3 sm:px-4 py-2 rounded border border-[#e5e5e5] focus:outline-none focus:border-[#3483fa] bg-white text-sm"
              />
            </div>
          </div>

          {/* Navigation Menu - Priority 3: Hides first on smaller screens */}
          <div className="hidden xl:flex items-center space-x-4 text-sm text-[#333333] flex-shrink-0">
            <span className="hover:text-[#3483fa] cursor-pointer">Categorías</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Ofertas</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Historial</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Supermercado</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Moda</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Vender</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Ayuda</span>
          </div>

          {/* Compact Navigation for medium screens */}
          <div className="hidden lg:flex xl:hidden items-center space-x-3 text-sm text-[#333333] flex-shrink-0">
            <span className="hover:text-[#3483fa] cursor-pointer">Categorías</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Ofertas</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Vender</span>
            <span className="hover:text-[#3483fa] cursor-pointer">Ayuda</span>
          </div>

          {/* Mobile Menu Button - Shows on small screens */}
          <div className="lg:hidden flex-shrink-0">
            <button className="p-2 text-[#333333] hover:text-[#3483fa]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb with Back Button */}
      <div className="bg-[#ededed] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <button onClick={() => router.back()} className="flex items-center space-x-1 text-[#3483fa] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver</span>
          </button>
          <div className="text-sm text-[#666666]">
            También puede interesarte: <span className="text-[#3483fa]">samsung galaxy a15</span> -{" "}
            <span className="text-[#3483fa]">samsung a15</span> -{" "}
            <span className="text-[#3483fa]">celular samsung</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Product Details */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-white rounded-lg border border-[#e5e5e5] p-4 relative">
                  <Image
                    src={product.images?.[selectedImage]?.url || "/images/products/default.jpg"}
                    alt={product.images?.[selectedImage]?.alt || product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                          selectedImage === index ? "border-[#3483fa]" : "border-[#e5e5e5]"
                        }`}
                      >
                        <Image
                          src={image.thumbnail || image.url || "/images/products/default-thumb.jpg"}
                          alt={image.alt}
                          width={60}
                          height={60}
                          className="w-full h-full object-contain rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Header Info */}
                <div>
                  {product.seller?.isOfficial && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-[#3483fa]">Visita la Tienda oficial de {product.seller.name}</span>
                      {product.seller.verified && (
                        <div className="w-4 h-4 bg-[#3483fa] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-[#666666] mb-2">
                    {product.condition} | +{(product.salesCount || 0).toLocaleString()} vendidos
                  </div>

                  {product.category && (
                    <div className="mb-2">
                      <Badge className="bg-orange-500 text-white text-xs">MÁS VENDIDO</Badge>
                      <span className="text-sm text-[#3483fa] ml-2">{product.category}</span>
                    </div>
                  )}

                  <h1 className="text-2xl font-normal text-[#333333] mb-4">{product.title}</h1>

                  {product.reviews && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm font-medium">{product.reviews.rating}</span>
                      <div className="flex text-[#ffe600]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.reviews?.rating || 0) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-[#666666]">({(product.reviews.count || 0).toLocaleString()})</span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                {validPriceOption && (
                  <div className="space-y-2">
                    {validPriceOption.originalPrice && (
                      <div className="text-sm text-[#666666] line-through">
                        $ {validPriceOption.originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-light text-[#333333]">
                        $ {Math.round(validPriceOption.price || 0).toLocaleString()}
                      </span>
                      {discount && <Badge className="bg-[#00a650] text-white">{discount}% OFF</Badge>}
                    </div>
                    {validPriceOption.installments && (
                      <div className="text-sm text-[#00a650]">
                        Mismo precio en {validPriceOption.installments.count} cuotas de ${" "}
                        {Math.round(
                          (validPriceOption.price || 0) / validPriceOption.installments.count,
                        ).toLocaleString()}
                        {validPriceOption.installments.interestFree && <sup>61</sup>}
                      </div>
                    )}
                    <div className="text-sm text-[#666666]">o en cuotas sin tarjeta</div>
                    <div className="text-sm text-[#3483fa] cursor-pointer">Ver los medios de pago</div>

                    {/* Show discount information */}
                    {validPriceOption.discount && (
                      <div className="text-sm text-[#00a650]">💰 {validPriceOption.discount.reason}</div>
                    )}
                  </div>
                )}

                {/* Color Selection */}
                {product.colorVariants && product.colorVariants.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-[#333333]">
                      Color: {selectedColorData?.name || "Seleccionar"}
                    </div>
                    <div className="flex space-x-2 flex-wrap">
                      {product.colorVariants.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => color.available && setSelectedColor(color.id)}
                          disabled={!color.available}
                          className={`w-8 h-8 rounded border-2 ${
                            selectedColor === color.id ? "border-[#3483fa] border-2" : "border-[#e5e5e5]"
                          } ${!color.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Memory Selection */}
                {product.memoryVariants && product.memoryVariants.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-[#333333]">
                      Memoria RAM: {selectedMemoryData?.name || "Seleccionar"}
                    </div>
                    <div className="flex space-x-2 flex-wrap">
                      {product.memoryVariants.map((memory) => (
                        <Button
                          key={memory.id}
                          variant={selectedMemory === memory.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => memory.available && setSelectedMemory(memory.id)}
                          disabled={!memory.available}
                          className={`${
                            selectedMemory === memory.id
                              ? "bg-[#3483fa] text-white border-[#3483fa]"
                              : "border-[#e5e5e5] text-[#333333]"
                          } ${!memory.available ? "opacity-50" : ""}`}
                        >
                          {memory.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-medium text-[#333333]">Lo que tenés que saber de este producto</h3>
                    <ul className="space-y-2 text-sm text-[#666666]">
                      {product.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                    {product.specifications && (
                      <div className="text-sm text-[#3483fa] cursor-pointer">Ver características</div>
                    )}
                  </div>
                )}

                {/* Purchase Protection & Shipping */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-[#00a650]">
                    <Shield className="w-4 h-4" />
                    <span>Compra Protegida, recibe el producto que esperaste o te devolvemos tu dinero</span>
                  </div>
                  {product.shipping?.map((shipping, index) => (
                    <div key={index} className="flex items-center space-x-2 text-[#666666]">
                      <Truck className="w-4 h-4" />
                      <span>
                        {shipping.description} {shipping.estimatedDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Payment Options */}
          <div className="space-y-6 order-3 lg:order-2">
            <Card className="border border-[#e5e5e5]">
              <CardContent className="p-4 space-y-6">
                {/* Price Options */}
                {product.priceOptions
                  ?.filter((option) => option.price && option.price > 0)
                  .map((option, index) => (
                    <div key={option.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-[#666666] mb-1">{option.title}</div>

                          {/* Show original price if there's a discount */}
                          {option.originalPrice && option.originalPrice !== option.price && (
                            <div className="text-sm text-[#666666] line-through mb-1">
                              $ {option.originalPrice.toLocaleString()}
                            </div>
                          )}

                          <div className="text-2xl font-light text-[#333333] mb-1">
                            $ {Math.round(option.price || 0).toLocaleString()}
                            {option.discount && (
                              <Badge className="bg-[#00a650] text-white text-xs ml-2">
                                {option.discount.type === "percentage"
                                  ? `${option.discount.value}% OFF`
                                  : `$${Math.round(option.discount.value || 0).toLocaleString()} OFF`}
                              </Badge>
                            )}
                          </div>

                          <div className="text-xs text-[#666666] flex items-center">
                            {option.description || option.seller?.displayName}
                            {option.seller?.verified && (
                              <div className="w-4 h-4 bg-[#3483fa] rounded-full ml-1 flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>

                          {option.installments && (
                            <div className="text-sm text-[#00a650] mt-1">
                              Mismo precio en {option.installments.count} cuotas de ${" "}
                              {Math.round((option.price || 0) / option.installments.count).toLocaleString()}
                            </div>
                          )}

                          {/* Show discount reason */}
                          {option.discount && (
                            <div className="text-xs text-[#00a650] mt-1">{option.discount.reason}</div>
                          )}
                        </div>
                        <input
                          type="radio"
                          name="price-option"
                          value={option.id}
                          checked={selectedPriceOption === option.id}
                          onChange={(e) => setSelectedPriceOption(e.target.value)}
                          className="mt-2 text-[#3483fa] focus:ring-[#3483fa]"
                        />
                      </div>
                      {index < product.priceOptions.filter((opt) => opt.price && opt.price > 0).length - 1 && (
                        <hr className="border-[#e5e5e5] mt-4" />
                      )}
                    </div>
                  ))}

                <hr className="border-[#e5e5e5]" />

                {/* Shipping Options */}
                {product.shipping && product.shipping.length > 0 && (
                  <div className="space-y-3">
                    {product.shipping.map((shipping, index) => (
                      <div key={index}>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-[#00a650] font-medium">
                            {shipping.type === "free" ? "Llega gratis" : "Retira gratis"}
                          </span>
                          <span className="text-sm text-[#333333]">{shipping.estimatedDate}</span>
                        </div>
                        {shipping.additionalInfo && (
                          <div className="text-sm text-[#333333] ml-0">{shipping.additionalInfo}</div>
                        )}
                      </div>
                    ))}
                    <div className="text-sm text-[#3483fa] cursor-pointer">Más formas de entrega</div>
                    <div className="text-sm text-[#3483fa] cursor-pointer">Ver en el mapa</div>
                  </div>
                )}

                <hr className="border-[#e5e5e5]" />

                {/* Stock */}
                {product.stock && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-[#333333]">
                      {product.stock.available ? "Stock disponible" : "Sin stock"}
                    </div>
                    {product.stock.fulfilledBy && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-[#666666]">Almacenado y enviado por</span>
                        <Badge className="bg-[#00a650] text-white text-xs px-2 py-1">{product.stock.fulfilledBy}</Badge>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                {product.stock?.available && (
                  <div className="space-y-2">
                    <div className="text-sm text-[#333333]">
                      <span className="font-medium">Cantidad:</span>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="ml-2 border border-[#e5e5e5] rounded px-2 py-1 text-sm"
                      >
                        {[...Array(Math.min(product.stock.quantity || 10, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} unidad{i > 0 ? "es" : ""}
                          </option>
                        ))}
                      </select>
                      {product.stock.quantity && (
                        <span className="text-[#666666] ml-2">(+{product.stock.quantity} disponibles)</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Purchase Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-[#3483fa] hover:bg-[#1434cb] text-white py-3 text-base font-medium"
                    disabled={!product.stock?.available}
                  >
                    Comprar ahora
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-[#3483fa] text-[#3483fa] hover:bg-[#3483fa] hover:text-white py-3 text-base font-medium"
                    onClick={handleAddToCart}
                    disabled={!product.stock?.available}
                  >
                    Agregar al carrito
                  </Button>
                </div>

                {/* Free Shipping Promotion */}
                {product.freeShippingPromo && (
                  <div className="bg-[#e8f5e8] border border-[#00a650] rounded p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#00a650] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Truck className="w-3 h-3 text-white" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-[#333333] mb-1">Conseguí envío gratis</div>
                        <div className="text-[#333333] mb-1">
                          armando un carrito
                          <Badge className="bg-[#00a650] text-white text-xs mx-1">FULL</Badge>
                        </div>
                        <div className="text-[#333333]">
                          Agregá a tu carrito $ {(product.freeShippingPromo.threshold || 0).toLocaleString()} en
                          productos Full y recibílos gratis.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seller Info */}
                {product.seller && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-[#333333] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {product.seller.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="text-[#333333]">{product.seller.isOfficial ? "Tienda oficial " : ""}</span>
                          <span className="text-[#3483fa]">{product.seller.name}</span>
                          {product.seller.verified && (
                            <div className="w-4 h-4 bg-[#3483fa] rounded-full inline-flex items-center justify-center ml-1">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        {product.seller.salesCount && (
                          <div className="text-xs text-[#666666]">{product.seller.salesCount} ventas</div>
                        )}
                        {product.seller.location && (
                          <div className="text-xs text-[#666666]">{product.seller.location}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products - Now comes after sidebar on mobile */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12 order-2 lg:order-3">
            <h2 className="text-xl font-medium text-[#333333] mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="border border-[#e5e5e5] hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigateToProduct(relatedProduct.id)}
                >
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={relatedProduct.image || "/images/products/default.jpg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="text-sm text-[#333333] mb-2 line-clamp-2 min-h-[2.5rem]">{relatedProduct.name}</h3>
                    <div className="space-y-1">
                      <div className="text-lg font-medium text-[#333333]">
                        $ {(relatedProduct.price || 0).toLocaleString()}
                      </div>
                      {relatedProduct.originalPrice && (
                        <div className="text-sm text-[#666666] line-through">
                          $ {relatedProduct.originalPrice.toLocaleString()}
                        </div>
                      )}
                      {relatedProduct.freeShipping && <div className="text-sm text-[#00a650]">Envío gratis</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
