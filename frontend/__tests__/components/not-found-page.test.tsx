import { render, screen, fireEvent } from "@testing-library/react"
import { NotFoundPage } from "../../components/not-found-page"

// Mock useRouter
const mockPush = jest.fn()
const mockBack = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}))

describe("NotFoundPage", () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockBack.mockClear()
  })

  it("should render with default props", () => {
    render(<NotFoundPage />)

    expect(screen.getByText("Parece que esta página no existe")).toBeInTheDocument()
    expect(screen.getByText("El producto que buscas no está disponible o fue removido.")).toBeInTheDocument()
    expect(screen.getByText("Ir a la página principal")).toBeInTheDocument()
    expect(screen.getByText("Volver atrás")).toBeInTheDocument()
  })

  it("should render with custom props", () => {
    render(<NotFoundPage title="Custom Title" message="Custom Message" showBackButton={false} />)

    expect(screen.getByText("Custom Title")).toBeInTheDocument()
    expect(screen.getByText("Custom Message")).toBeInTheDocument()
    expect(screen.queryByText("Volver atrás")).not.toBeInTheDocument()
  })

  it("should navigate to home page when clicking main button", () => {
    render(<NotFoundPage />)

    const homeButton = screen.getByText("Ir a la página principal")
    fireEvent.click(homeButton)

    expect(mockPush).toHaveBeenCalledWith("/")
  })

  it("should go back when clicking back button", () => {
    render(<NotFoundPage />)

    const backButton = screen.getByText("Volver atrás")
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })

  it("should navigate to search when clicking explore categories", () => {
    render(<NotFoundPage />)

    const exploreButton = screen.getByText("Explorar categorías")
    fireEvent.click(exploreButton)

    expect(mockPush).toHaveBeenCalledWith("/search")
  })

  it("should navigate to help when clicking contact support", () => {
    render(<NotFoundPage />)

    const helpButton = screen.getByText("Contactar soporte")
    fireEvent.click(helpButton)

    expect(mockPush).toHaveBeenCalledWith("/help")
  })

  it("should have proper accessibility attributes", () => {
    render(<NotFoundPage />)

    const buttons = screen.getAllByRole("button")
    buttons.forEach((button) => {
      expect(button).toBeInTheDocument()
    })

    // Check for proper heading structure
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})
