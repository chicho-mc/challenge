import { render, screen } from "@testing-library/react"
import { ProductSkeleton } from "../../components/loading-skeleton"

describe("ProductSkeleton", () => {
  it("should render skeleton elements", () => {
    render(<ProductSkeleton />)

    // Check for skeleton structure using a more specific selector
    const skeletonContainer = screen.getByTestId("product-skeleton")
    expect(skeletonContainer).toHaveClass("animate-pulse")

    // Check for grid layout
    const gridContainer = skeletonContainer.querySelector(".grid")
    expect(gridContainer).toBeInTheDocument()
  })

  it("should have proper accessibility structure", () => {
    const { container } = render(<ProductSkeleton />)

    // Should have proper div structure for screen readers
    const skeletonElements = container.querySelectorAll(".bg-gray-200")
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})
