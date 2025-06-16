import React from "react"
import { render } from "@testing-library/react"
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card"

describe("Card UI components", () => {
  it("renders Card with custom className and children", () => {
    const { getByTestId } = render(
      <Card className="custom-card" data-testid="card">Card Content</Card>
    )
    const card = getByTestId("card")
    expect(card).toHaveClass("custom-card")
    expect(card).toHaveAttribute("data-slot", "card")
    expect(card).toHaveTextContent("Card Content")
  })

  it("renders CardHeader with children", () => {
    const { getByTestId } = render(
      <CardHeader data-testid="header">Header</CardHeader>
    )
    expect(getByTestId("header")).toHaveAttribute("data-slot", "card-header")
  })

  it("renders CardTitle with children", () => {
    const { getByTestId } = render(
      <CardTitle data-testid="title">Title</CardTitle>
    )
    expect(getByTestId("title")).toHaveAttribute("data-slot", "card-title")
  })

  it("renders CardDescription with children", () => {
    const { getByTestId } = render(
      <CardDescription data-testid="desc">Description</CardDescription>
    )
    expect(getByTestId("desc")).toHaveAttribute("data-slot", "card-description")
  })

  it("renders CardAction with children", () => {
    const { getByTestId } = render(
      <CardAction data-testid="action">Action</CardAction>
    )
    expect(getByTestId("action")).toHaveAttribute("data-slot", "card-action")
  })

  it("renders CardContent with children", () => {
    const { getByTestId } = render(
      <CardContent data-testid="content">Content</CardContent>
    )
    expect(getByTestId("content")).toHaveAttribute("data-slot", "card-content")
  })

  it("renders CardFooter with children", () => {
    const { getByTestId } = render(
      <CardFooter data-testid="footer">Footer</CardFooter>
    )
    expect(getByTestId("footer")).toHaveAttribute("data-slot", "card-footer")
  })

  it("passes additional props to Card", () => {
    const { getByTestId } = render(
      <Card data-testid="card" aria-label="test-label">Test</Card>
    )
    expect(getByTestId("card")).toHaveAttribute("aria-label", "test-label")
  })

  it("applies custom className to CardFooter", () => {
    const { getByTestId } = render(
      <CardFooter data-testid="footer" className="custom-footer">Footer</CardFooter>
    )
    expect(getByTestId("footer")).toHaveClass("custom-footer")
  })
})
