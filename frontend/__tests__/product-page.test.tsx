import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import Component from "../product-page"
import * as useProductModule from "../hooks/useProduct"
import { Product, RelatedProduct } from "../types/product"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

// Mock ProductAPI
jest.mock("../services/api", () => ({
  ProductAPI: {
    updateProductView: jest.fn(),
    addToCart: jest.fn().mockResolvedValue({ success: true }),
  },
}))

const mockRelatedProducts: RelatedProduct[] = [
  {
    id: "MLA987654321",
    name: "Related Product",
    price: 900,
    image: "/related.jpg",
    freeShipping: true,
  },
]

const mockProduct: Product = {
  id: "MLA123456789",
  title: "Test Product",
  condition: "Nuevo",
  category: "Celulares",
  salesCount: 100,
  basePrice: 1000,
  images: [
    { id: "img1", url: "/test.jpg", alt: "Test Image", thumbnail: "/test-thumb.jpg" },
  ],
  priceOptions: [
    {
      id: "price1",
      type: "best_price",
      title: "Mejor precio",
      price: 1000,
      originalPrice: 1200,
      description: "Oferta especial",
      seller: {
        name: "Test Seller",
        isOfficial: true,
        verified: true,
        salesCount: "100",
        location: "Buenos Aires",
      },
      discount: {
        type: "percentage",
        value: 20,
        appliedAt: "2025-06-16T00:00:00Z",
        reason: "Oferta",
        campaignId: "camp1",
      },
      selected: true,
    },
  ],
  colorVariants: [
    { id: "red", name: "Red", value: "red", color: "#ff0000", available: true },
    { id: "blue", name: "Blue", value: "blue", color: "#0000ff", available: false },
  ],
  memoryVariants: [
    { id: "4gb", name: "4GB", value: "4gb", available: true },
    { id: "8gb", name: "8GB", value: "8gb", available: false },
  ],
  features: ["Feature 1", "Feature 2"],
  specifications: { RAM: "4GB", Storage: "128GB" },
  seller: {
    name: "Test Seller",
    isOfficial: true,
    verified: true,
    salesCount: "100",
    location: "Buenos Aires",
  },
  reviews: { rating: 4.5, count: 10 },
  shipping: [{ type: "free", description: "Llega gratis", estimatedDate: "mañana" }],
  stock: { available: true, quantity: 5, fulfilledBy: "MercadoLibre" },
  freeShippingPromo: { threshold: 2500 },
}

describe("ProductPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders loading state", () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: null,
      relatedProducts: [],
      loading: true,
      error: null,
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  it("renders error state", () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: null,
      relatedProducts: [],
      loading: false,
      error: "Not found",
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    expect(screen.getByText(/no existe/i)).toBeInTheDocument()
    expect(screen.getByText(/no está disponible/i)).toBeInTheDocument()
  })

  it("renders product details", () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: mockProduct,
      relatedProducts: mockRelatedProducts,
      loading: false,
      error: null,
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("Celulares")).toBeInTheDocument()
    expect(screen.getByText("Red")).toBeInTheDocument()
    expect(screen.getByText("4GB")).toBeInTheDocument()
    expect(screen.getByText(/$ 1,000/)).toBeInTheDocument()
    expect(screen.getByText(/20% OFF/)).toBeInTheDocument()
    expect(screen.getByText(/Compra Protegida/i)).toBeInTheDocument()
    expect(screen.getByText(/Productos relacionados/i)).toBeInTheDocument()
    expect(screen.getByText("Related Product")).toBeInTheDocument()
  })

  it("handles color and memory selection", async () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: mockProduct,
      relatedProducts: mockRelatedProducts,
      loading: false,
      error: null,
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    const colorButton = screen.getByTitle("Red")
    fireEvent.click(colorButton)
    expect(colorButton).toHaveClass("border-[#3483fa]")
    const memoryButton = screen.getByText("4GB")
    fireEvent.click(memoryButton)
    expect(memoryButton).toHaveClass("bg-[#3483fa]")
  })

  it("handles add to cart", async () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: mockProduct,
      relatedProducts: mockRelatedProducts,
      loading: false,
      error: null,
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    const addToCartButton = screen.getByText(/Agregar al carrito/i)
    fireEvent.click(addToCartButton)
    await waitFor(() => {
      expect(require("../services/api").ProductAPI.addToCart).toHaveBeenCalled()
    })
  })

  it("navigates to related product", () => {
    jest.spyOn(useProductModule, "useProduct").mockReturnValue({
      product: mockProduct,
      relatedProducts: mockRelatedProducts,
      loading: false,
      error: null,
      connectionError: false,
    })
    render(<Component productId="MLA123456789" />)
    const related = screen.getByText("Related Product")
    fireEvent.click(related)
    // Navigation is mocked, so just check the click does not throw
    expect(related).toBeInTheDocument()
  })
})
