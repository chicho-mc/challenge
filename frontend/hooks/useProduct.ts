"use client"

import { useState, useEffect } from "react"
import type { Product, RelatedProduct } from "../types/product"
import { ProductAPI } from "../services/api"

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<boolean>(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        setConnectionError(false)

        console.log(`Fetching product: ${productId}`)
        console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001"}`)

        // Test connection first
        console.log("Testing connection to Flask server...")
        const connectionTest = await ProductAPI.testConnection()

        if (!connectionTest) {
          console.error("Connection test failed")
          setConnectionError(true)
          setError("Cannot connect to server. Please check if the Flask backend is running.")
          setLoading(false)
          return
        }

        console.log("Connection test passed, fetching product data...")

        // Fetch product from API
        const productResult = await ProductAPI.getProduct(productId)

        if (productResult.success && productResult.data && Object.keys(productResult.data).length > 0) {
          console.log("Product data received from API:", productResult.data)
          setProduct(productResult.data)

          // Track product view
          ProductAPI.updateProductView(productId)

          // Fetch related products
          console.log(`Fetching related products for: ${productId}`)
          const relatedResult = await ProductAPI.getRelatedProducts(productId)

          if (relatedResult.success && relatedResult.data && relatedResult.data.length > 0) {
            console.log("Related products received from API:", relatedResult.data)
            setRelatedProducts(relatedResult.data)
          } else {
            console.log("No related products found")
            setRelatedProducts([])
          }
        } else {
          console.log("Product not found or invalid response")
          setError("Product not found")
          setProduct(null)
          setRelatedProducts([])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred"
        console.error("Error fetching product data:", errorMessage)

        // Check if this is a connection error
        if (errorMessage.includes("Network error") || errorMessage.includes("timeout")) {
          setConnectionError(true)
          setError("Network error - cannot connect to server")
        } else {
          setError(errorMessage)
        }

        setProduct(null)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  return { product, relatedProducts, loading, error, connectionError }
}
