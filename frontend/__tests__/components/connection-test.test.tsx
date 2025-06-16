import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ConnectionTest } from "../../components/connection-test"
import { ProductAPI } from "../../services/api"

// Mock ProductAPI
jest.mock("../../services/api")
const mockProductAPI = ProductAPI as jest.Mocked<typeof ProductAPI>

describe("ConnectionTest", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset window.location
    Object.defineProperty(window, "location", {
      value: { hostname: "localhost" },
      writable: true,
    })
  })

  it("should render initial state", () => {
    render(<ConnectionTest />)

    expect(screen.getByText("Flask API Connection")).toBeInTheDocument()
    expect(screen.getByText("API URL:")).toBeInTheDocument()
    expect(screen.getByText("Status:")).toBeInTheDocument()
    expect(screen.getByText("Test Connection")).toBeInTheDocument()
  })

  it("should show testing state when button is clicked", async () => {
    mockProductAPI.testConnection.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100)),
    )

    render(<ConnectionTest />)

    const testButton = screen.getByText("Test Connection")
    fireEvent.click(testButton)

    // Use getAllByText to avoid ambiguity
    const testingElements = screen.getAllByText("Testing...")
    expect(testingElements.length).toBeGreaterThanOrEqual(2)
    testingElements.forEach(el => expect(el).toBeInTheDocument())
    expect(testButton).toBeDisabled()
  })

  it("should show success state on successful connection", async () => {
    mockProductAPI.testConnection.mockResolvedValue(true)

    render(<ConnectionTest />)

    const testButton = screen.getByText("Test Connection")
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText("Connected")).toBeInTheDocument()
    })
  })

  it("should show error state on failed connection", async () => {
    mockProductAPI.testConnection.mockResolvedValue(false)

    render(<ConnectionTest />)

    const testButton = screen.getByText("Test Connection")
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText("Failed")).toBeInTheDocument()
    })
  })

  it("should show error message and troubleshooting steps on exception", async () => {
    mockProductAPI.testConnection.mockRejectedValue(new Error("Network error"))

    render(<ConnectionTest />)

    const testButton = screen.getByText("Test Connection")
    fireEvent.click(testButton)

    await waitFor(() => {
      expect(screen.getByText("Error:")).toBeInTheDocument()
      expect(screen.getByText("Network error")).toBeInTheDocument()
      expect(screen.getByText("Troubleshooting:")).toBeInTheDocument()
      expect(screen.getByText(/Make sure Flask server is running/)).toBeInTheDocument()
      expect(screen.getByText(/Check if CORS is enabled/)).toBeInTheDocument()
      expect(screen.getByText(/Verify the API_URL environment variable/)).toBeInTheDocument()
      expect(screen.getByText(/Check browser console for detailed errors/)).toBeInTheDocument()
      expect(screen.getByText(/Test the API directly/)).toBeInTheDocument()
    })
  })
})
