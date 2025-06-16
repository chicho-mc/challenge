import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/product/MLA123456789",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
}))

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:5001"

// Mock fetch globally
global.fetch = jest.fn()

// Setup fetch mock reset
const beforeEach = () => {
  fetch.mockClear()
}

beforeEach()
