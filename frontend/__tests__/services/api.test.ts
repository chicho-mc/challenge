import { ProductAPI } from "../../services/api"
import type { Product, RelatedProduct } from "../../types/product"
import type { jest } from "@jest/globals"

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe("ProductAPI", () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Reset window.location
    Object.defineProperty(window, "location", {
      value: { hostname: "localhost" },
      writable: true,
    })
  })

  describe("getProduct", () => {
    it("should fetch product successfully", async () => {
      const mockProduct: Product = {
        id: "MLA123456789",
        title: "Test Product",
        condition: "Nuevo",
        salesCount: 100,
        basePrice: 100000,
        images: [],
        priceOptions: [],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: mockProduct,
        }),
        headers: new Headers(),
      } as Response)

      const result = await ProductAPI.getProduct("MLA123456789")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockProduct)
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/products/MLA123456789",
        expect.objectContaining({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
      )
    })

    it("should handle 404 errors gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: "Product not found" }),
        headers: new Headers(),
      } as Response)

      const result = await ProductAPI.getProduct("INVALID_ID")

      expect(result.success).toBe(false)
      expect(result.message).toBe("Product not found")
    })

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const result = await ProductAPI.getProduct("MLA123456789")

      expect(result.success).toBe(false)
      expect(result.message).toBe("Network error")
    })

    it("should handle timeout errors", async () => {
      const abortError = new Error("Timeout")
      abortError.name = "AbortError"
      mockFetch.mockRejectedValueOnce(abortError)

      const result = await ProductAPI.getProduct("MLA123456789")

      expect(result.success).toBe(false)
      expect(result.message).toBe("Request timeout - check if Flask server is running")
    })

    it("should handle v0 environment detection", async () => {
      // Mock v0 environment
      Object.defineProperty(window, "location", {
        value: { hostname: "test.vusercontent.net" },
        writable: true,
      })

      // Don't mock fetch for this test - let it try to make real request
      mockFetch.mockRejectedValueOnce(new Error("Network error"))

      const result = await ProductAPI.getProduct("MLA123456789")

      expect(result.success).toBe(false)
      expect(result.message).toBe("Network error")

      // Reset
      Object.defineProperty(window, "location", {
        value: { hostname: "localhost" },
        writable: true,
      })
    })

    it("should handle error response with invalid JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error("Invalid JSON") },
        headers: new Headers(),
        redirected: false,
        statusText: "Internal Server Error",
        type: "basic",
        url: "",
        clone: () => { throw new Error("not implemented") },
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        text: async () => "",
      } as unknown as Response)

      const result = await ProductAPI.getProduct("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("HTTP error! status: 500")
    })

    it("should handle error object that is not an instance of Error", async () => {
      // @ts-ignore
      mockFetch.mockRejectedValueOnce("string error")
      const result = await ProductAPI.getProduct("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Failed to fetch product")
    })

    it("should handle getProduct error with no message property", async () => {
      // Simulate error object without message
      mockFetch.mockRejectedValueOnce({})
      const result = await ProductAPI.getProduct("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Failed to fetch product")
    })

    it("should handle getProduct error with message property but not instanceof Error", async () => {
      mockFetch.mockRejectedValueOnce({ message: "Custom error message" })
      const result = await ProductAPI.getProduct("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Custom error message")
    })
  })

  describe("getRelatedProducts", () => {
    it("should fetch related products successfully", async () => {
      const mockRelatedProducts: RelatedProduct[] = [
        {
          id: "MLA987654321",
          name: "Related Product",
          price: 50000,
          image: "/test.jpg",
          freeShipping: true,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: mockRelatedProducts,
        }),
        headers: new Headers(),
      } as Response)

      const result = await ProductAPI.getRelatedProducts("MLA123456789")

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockRelatedProducts)
    })

    it("should handle empty related products", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
      } as Response)

      const result = await ProductAPI.getRelatedProducts("MLA123456789")

      expect(result.success).toBe(false)
      expect(result.data).toEqual([])
    })

    it("should handle malformed data in related products response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      } as Response)
      const result = await ProductAPI.getRelatedProducts("MLA123456789")
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it("should handle timeout error", async () => {
      const abortError = new Error("Timeout")
      abortError.name = "AbortError"
      mockFetch.mockRejectedValueOnce(abortError)
      const result = await ProductAPI.getRelatedProducts("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Request timeout")
    })

    it("should handle getRelatedProducts error with no message property", async () => {
      mockFetch.mockRejectedValueOnce({})
      const result = await ProductAPI.getRelatedProducts("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Failed to fetch related products")
    })

    it("should handle getRelatedProducts error with message property but not instanceof Error", async () => {
      mockFetch.mockRejectedValueOnce({ message: "Related error" })
      const result = await ProductAPI.getRelatedProducts("MLA123456789")
      expect(result.success).toBe(false)
      expect(result.message).toBe("Related error")
    })
  })

  describe("testConnection", () => {
    it("should return true for successful connection", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
      } as Response)

      const result = await ProductAPI.testConnection()

      expect(result).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/merchants",
        expect.objectContaining({
          method: "GET",
        }),
      )
    })

    it("should return false for failed connection", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Connection failed"))

      const result = await ProductAPI.testConnection()

      expect(result).toBe(false)
    })
  })

  describe("addToCart", () => {
    it("should simulate successful cart addition", async () => {
      const result = await ProductAPI.addToCart("MLA123456789", "variant1", 2)

      expect(result.success).toBe(true)
      expect(result.data.message).toBe("Product added to cart successfully")
    })
  })

  describe("updateProductView", () => {
    it("should not throw errors on analytics failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Analytics failed"))

      await expect(ProductAPI.updateProductView("MLA123456789")).resolves.not.toThrow()
    })
  })
})
