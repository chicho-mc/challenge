import type { Product, PriceOption, ProductImage, ProductVariant } from "../../types/product"

describe("Product Types", () => {
  describe("Product interface", () => {
    it("should have all required properties", () => {
      const product: Product = {
        id: "MLA123456789",
        title: "Test Product",
        condition: "Nuevo",
        salesCount: 100,
        basePrice: 100000,
        images: [],
        priceOptions: [],
      }

      expect(product.id).toBe("MLA123456789")
      expect(product.title).toBe("Test Product")
      expect(product.condition).toBe("Nuevo")
      expect(product.salesCount).toBe(100)
      expect(product.basePrice).toBe(100000)
      expect(Array.isArray(product.images)).toBe(true)
      expect(Array.isArray(product.priceOptions)).toBe(true)
    })
  })

  describe("PriceOption interface", () => {
    it("should have correct structure", () => {
      const priceOption: PriceOption = {
        id: "best_price",
        type: "best_price",
        title: "Mejor precio",
        price: 90000,
        description: "Test description",
        seller: {
          name: "Test Seller",
          isOfficial: true,
          verified: true,
        },
        selected: false,
      }

      expect(priceOption.type).toBe("best_price")
      expect(priceOption.seller.isOfficial).toBe(true)
      expect(priceOption.selected).toBe(false)
    })
  })

  describe("ProductImage interface", () => {
    it("should have required properties", () => {
      const image: ProductImage = {
        id: "img1",
        url: "/test-image.jpg",
        alt: "Test image",
      }

      expect(image.id).toBe("img1")
      expect(image.url).toBe("/test-image.jpg")
      expect(image.alt).toBe("Test image")
    })
  })

  describe("ProductVariant interface", () => {
    it("should have correct structure", () => {
      const variant: ProductVariant = {
        id: "blue",
        name: "Azul",
        value: "blue",
        available: true,
      }

      expect(variant.available).toBe(true)
      expect(variant.color).toBeUndefined()
    })

    it("should support optional color property", () => {
      const variant: ProductVariant = {
        id: "blue",
        name: "Azul",
        value: "blue",
        color: "#0000ff",
        available: true,
      }

      expect(variant.color).toBe("#0000ff")
    })
  })
})
