import { render, screen } from "@testing-library/react"
import ProductPage, { generateMetadata } from "../../../../app/product/[id]/page"

// Mock the product page component
jest.mock("../../../../product-page", () => {
  return function MockProductPage({ productId }: { productId: string }) {
    return <div data-testid="product-page">Product ID: {productId}</div>
  }
})

describe("ProductPage", () => {
  it("should render with product ID", async () => {
    const mockParams = Promise.resolve({ id: "MLA123456789" })

    const ProductPageComponent = await ProductPage({ params: mockParams })

    render(ProductPageComponent)

    expect(screen.getByTestId("product-page")).toBeInTheDocument()
    expect(screen.getByText("Product ID: MLA123456789")).toBeInTheDocument()
  })

  it("should handle missing product ID", async () => {
    const mockParams = Promise.resolve({ id: "" })

    const ProductPageComponent = await ProductPage({ params: mockParams })

    render(ProductPageComponent)

    // Should fallback to default product ID
    expect(screen.getByText("Product ID: MLA123456789")).toBeInTheDocument()
  })

  it("should handle params promise rejection in ProductPage", async () => {
    const mockParams = Promise.reject(new Error("Promise rejected"))
    // Silence expected error
    jest.spyOn(console, "error").mockImplementation(() => {})
    const ProductPageComponent = await ProductPage({ params: mockParams })
    render(ProductPageComponent)
    expect(screen.getByText("Product ID: MLA123456789")).toBeInTheDocument()
    ;(console.error as jest.Mock).mockRestore?.()
  })
})

describe("generateMetadata", () => {
  it("should return metadata with product ID", async () => {
    const mockParams = Promise.resolve({ id: "MLA123456789" })
    const meta = await generateMetadata({ params: mockParams })
    expect(meta.title).toContain("MLA123456789")
    expect(meta.description).toContain("MLA123456789")
  })

  it("should return default metadata on error", async () => {
    const mockParams = Promise.reject(new Error("Promise rejected"))
    const meta = await generateMetadata({ params: mockParams })
    expect(meta.title).toBe("Product - MercadoLibre Clone")
    expect(meta.description).toBe("View product details")
  })
})
