import { render, screen } from "@testing-library/react"
import NotFound from "../../app/not-found"

describe("NotFound", () => {
  it("should render not found page", () => {
    render(<NotFound />)

    expect(screen.getByText("Parece que esta página no existe")).toBeInTheDocument()
    expect(screen.getByText("La página que buscas no está disponible o fue removida.")).toBeInTheDocument()
  })
})
