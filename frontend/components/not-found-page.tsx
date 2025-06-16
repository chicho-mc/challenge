"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface NotFoundPageProps {
  title?: string
  message?: string
  showBackButton?: boolean
}

export function NotFoundPage({
  title = "Parece que esta página no existe",
  message = "El producto que buscas no está disponible o fue removido.",
  showBackButton = true,
}: NotFoundPageProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <header className="bg-[#ffe600] px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/mercado-libre-challenge-logo.png"
                alt="Mercado Libre Challenge"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </div>
          </div>
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, marcas y más..."
                className="w-full px-4 py-2 rounded border border-[#e5e5e5] focus:outline-none focus:border-[#3483fa]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-[#333333]">
            <span>Categorías</span>
            <span>Ofertas</span>
            <span>Historial</span>
            <span>Supermercado</span>
            <span>Moda</span>
            <span>Vender</span>
            <span>Ayuda</span>
          </div>
        </div>
      </header>

      {/* 404 Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="max-w-md w-full text-center">
          {/* Laptop Illustration */}
          <div className="mb-8 flex justify-center">
            <svg
              width="200"
              height="140"
              viewBox="0 0 200 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-300"
            >
              {/* Laptop Base */}
              <rect x="20" y="100" width="160" height="20" rx="10" fill="currentColor" opacity="0.6" />

              {/* Laptop Screen */}
              <rect
                x="40"
                y="20"
                width="120"
                height="85"
                rx="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.7"
              />

              {/* Screen Content */}
              <rect x="50" y="30" width="100" height="65" rx="4" fill="currentColor" opacity="0.1" />

              {/* Question Mark Circle */}
              <circle cx="100" cy="62" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />

              {/* Question Mark */}
              <path
                d="M95 55c0-3 2-5 5-5s5 2 5 5c0 2-1 3-2 4l-1 2h-4l1-3c1-1 2-2 2-3 0-1-1-1-1-1s-1 0-1 1h-4z"
                fill="currentColor"
                opacity="0.5"
              />
              <circle cx="100" cy="72" r="1.5" fill="currentColor" opacity="0.5" />

              {/* Laptop Hinge */}
              <line x1="40" y1="105" x2="160" y2="105" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-2xl font-normal text-[#333333] mb-4">{title}</h1>

            <p className="text-[#666666] text-base mb-8">{message}</p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/")}
                className="w-full bg-[#3483fa] hover:bg-[#1434cb] text-white py-3 text-base font-medium"
              >
                Ir a la página principal
              </Button>

              {showBackButton && (
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full border-[#3483fa] text-[#3483fa] hover:bg-[#3483fa] hover:text-white py-3 text-base font-medium"
                >
                  Volver atrás
                </Button>
              )}
            </div>

            {/* Additional Help */}
            <div className="mt-8 pt-6 border-t border-[#e5e5e5]">
              <p className="text-sm text-[#666666] mb-4">¿No encontrás lo que buscás?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/search")}
                  className="text-[#3483fa] hover:bg-[#f0f8ff] text-sm"
                >
                  Explorar categorías
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/help")}
                  className="text-[#3483fa] hover:bg-[#f0f8ff] text-sm"
                >
                  Contactar soporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
