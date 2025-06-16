import type { Product, RelatedProduct, ApiResponse } from "../types/product"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001"

// Create AbortController with timeout for better compatibility
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController()

  // Only set timeout if AbortSignal.timeout is available (modern browsers)
  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    // Use native timeout if available
    const timeoutSignal = (AbortSignal as any).timeout(timeoutMs)
    timeoutSignal.addEventListener("abort", () => controller.abort())
  } else {
    // Fallback for older environments (like Jest)
    setTimeout(() => controller.abort(), timeoutMs)
  }

  return controller
}

export class ProductAPI {
  static async getProduct(productId: string): Promise<ApiResponse<Product>> {
    try {
      console.log(`Attempting to fetch product: ${productId} from ${API_BASE_URL}`)

      const controller = createTimeoutController(10000) // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        console.warn(`API returned ${response.status} for product ${productId}`)

        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.log("Could not parse error response as JSON")
        }

        return {
          success: false,
          data: {} as Product,
          message: errorMessage,
        }
      }

      const data = await response.json()
      console.log("API response received:", data)

      if (data.success && data.data) {
        return {
          success: true,
          data: data.data,
          message: "Product fetched successfully",
        }
      } else {
        throw new Error(data.message || "Invalid response format")
      }
    } catch (error) {
      console.error("API call failed:", error)

      if (error instanceof Error && (error.name === "AbortError" || error.message === "Timeout")) {
        return {
          success: false,
          data: {} as Product,
          message: "Request timeout - check if Flask server is running",
        }
      }

      // Accept error objects with a message property, even if not instanceof Error
      if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
        return {
          success: false,
          data: {} as Product,
          message: (error as any).message,
        }
      }

      if (error instanceof Error) {
        if (error.message && (error.message.includes("fetch") || error.message.includes("NetworkError"))) {
          return {
            success: false,
            data: {} as Product,
            message: "Network error - cannot connect to Flask server",
          }
        }

        return {
          success: false,
          data: {} as Product,
          message: error.message,
        }
      }

      return {
        success: false,
        data: {} as Product,
        message: "Failed to fetch product",
      }
    }
  }

  static async getRelatedProducts(productId: string): Promise<ApiResponse<RelatedProduct[]>> {
    try {
      console.log(`Attempting to fetch related products for: ${productId}`)

      const controller = createTimeoutController(10000) // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/related`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      console.log(`Related products response status: ${response.status}`)

      if (!response.ok) {
        console.warn(`Related products API returned ${response.status}`)
        return {
          success: false,
          data: [],
          message: `HTTP error! status: ${response.status}`,
        }
      }

      const data = await response.json()
      console.log("Related products response:", data)

      // Always return an array for data
      let products: RelatedProduct[] = []
      if (Array.isArray(data.data)) {
        products = data.data
      } else if (Array.isArray(data)) {
        products = data
      }

      return {
        success: true,
        data: products,
        message: "Related products fetched successfully",
      }
    } catch (error) {
      console.error("Related products API call failed:", error)

      if (error instanceof Error && (error.name === "AbortError" || error.message === "Timeout")) {
        return {
          success: false,
          data: [],
          message: "Request timeout",
        }
      }

      if (error && typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
        return {
          success: false,
          data: [],
          message: (error as any).message,
        }
      }

      return {
        success: false,
        data: [],
        message: error && typeof error === "object" && "message" in error ? (error as any).message : "Failed to fetch related products",
      }
    }
  }

  // Test connection to Flask server
  static async testConnection(): Promise<boolean> {
    try {
      console.log(`Testing connection to Flask server at ${API_BASE_URL}`)

      const controller = createTimeoutController(5000) // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/merchants`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      console.log(`Connection test response: ${response.status}`)
      return response.ok
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  }

  static async updateProductView(productId: string): Promise<void> {
    try {
      const controller = createTimeoutController(3000) // 3 second timeout

      await fetch(`${API_BASE_URL}/api/products/${productId}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })
    } catch (error) {
      console.warn("Failed to update product view:", error)
      // Don't throw error for analytics calls
    }
  }

  static async addToCart(productId: string, variantId: string, quantity: number): Promise<ApiResponse<any>> {
    try {
      // For now, simulate success since cart endpoint isn't implemented
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Adding to cart:", { productId, variantId, quantity })

      return {
        success: true,
        data: { message: "Product added to cart successfully" },
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : "Failed to add to cart",
      }
    }
  }
}
