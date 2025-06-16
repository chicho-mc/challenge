import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { NgrokSetupGuide } from "../../components/ngrok-setup-guide"

describe("NgrokSetupGuide", () => {
  it("renders all setup steps and info", () => {
    render(<NgrokSetupGuide />)
    expect(screen.getByText(/Setup ngrok for v0 Preview/)).toBeInTheDocument()
    expect(screen.getByText(/Why do I need ngrok/)).toBeInTheDocument()
    expect(screen.getByText(/Install ngrok using Homebrew/)).toBeInTheDocument()
    expect(screen.getByText(/Create a public tunnel/)).toBeInTheDocument()
    expect(screen.getByText(/Replace with the HTTPS URL/)).toBeInTheDocument()
    expect(screen.getByText(/After setup/)).toBeInTheDocument()
    expect(screen.getByText(/Use the HTTPS URL/)).toBeInTheDocument()
  })

  it("shows Copied! feedback when copy button is clicked", async () => {
    // Mock clipboard
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() }
    })
    render(<NgrokSetupGuide />)
    const copyButtons = screen.getAllByRole("button")
    // Click the first copy button
    fireEvent.click(copyButtons[0])
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument()
    })
  })
})
