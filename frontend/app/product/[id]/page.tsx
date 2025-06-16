import Component from "../../../product-page"
import { Suspense } from "react"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { id } = await params

    if (!id) {
      throw new Error("Product ID is required")
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Component productId={id} />
      </Suspense>
    )
  } catch (error) {
    console.error("Error in ProductPage:", error)
    return <Component productId="MLA123456789" />
  }
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { id } = await params
    return {
      title: `Product ${id} - MercadoLibre Clone`,
      description: `View details for product ${id}`,
    }
  } catch (error) {
    return {
      title: "Product - MercadoLibre Clone",
      description: "View product details",
    }
  }
}
