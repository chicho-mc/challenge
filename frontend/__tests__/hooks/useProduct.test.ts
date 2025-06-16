import { renderHook, waitFor } from "@testing-library/react"
import { useProduct } from "../../hooks/useProduct"
import { ProductAPI } from "../../services/api"

// Mock the ProductAPI
jest.mock("../../services/api")
const mockProductAPI = ProductAPI as jest.Mocked<typeof ProductAPI>

describe("useProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return loading state initially", () => {
    const { result } = renderHook(() => useProduct("MLA123456789"))

    expect(result.current.loading).toBe(true)
    expect(result.current.product).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it("should fetch product data successfully", async () => {
    // Test-specific mock data (not runtime fallback)
    const mockProduct = {
      id: "MLA123456789",
      title: "Test Product",
      condition: "Nuevo",
      salesCount: 100,
      basePrice: 100000,
      images: [],
      priceOptions: [],
    }

    const mockRelatedProducts = [
      {
        id: "MLA987654321",
        name: "Related Product",
        price: 50000,
        image: "/test.jpg",
        freeShipping: true,
      },
    ]

    // Mock API responses for this test
    mockProductAPI.testConnection.mockResolvedValue(true)
    mockProductAPI.getProduct.mockResolvedValue({
      success: true,
      data: mockProduct,
      message: "Success",
    })
    mockProductAPI.getRelatedProducts.mockResolvedValue({
      success: true,
      data: mockRelatedProducts,
      message: "Success",
    })
    mockProductAPI.updateProductView.mockResolvedValue()

    const { result } = renderHook(() => useProduct("MLA123456789"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.product).toEqual(mockProduct)
    expect(result.current.relatedProducts).toEqual(mockRelatedProducts)
    expect(result.current.error).toBe(null)
  })

  it("should handle API errors properly", async () => {
    mockProductAPI.testConnection.mockResolvedValue(false)
    mockProductAPI.getProduct.mockResolvedValue({
      success: false,
      data: {} as any,
      message: "API Error",
    })

    const { result } = renderHook(() => useProduct("UNKNOWN_ID"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Now properly shows error instead of using mock data
    expect(result.current.product).toBe(null)
    expect(result.current.error).toBeTruthy()
    expect(result.current.connectionError).toBe(true)
  })

  it("should handle connection errors gracefully", async () => {
    mockProductAPI.testConnection.mockRejectedValue(new Error("Network error"))

    const { result } = renderHook(() => useProduct("MLA123456789"))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should show proper error, not fallback to mock data
    expect(result.current.product).toBe(null)
    expect(result.current.error).toBeTruthy()
    expect(result.current.connectionError).toBe(true)
  })
})
