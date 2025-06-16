import { redirect } from "next/navigation"
import HomePage from "../../app/page"

// Mock Next.js redirect
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

describe("HomePage", () => {
  it("should redirect to default product", () => {
    HomePage()

    expect(redirect).toHaveBeenCalledWith("/product/MLA123456789")
  })
})
