import { NotFoundPage } from "../components/not-found-page"

export default function NotFound() {
  return (
    <NotFoundPage
      title="Parece que esta página no existe"
      message="La página que buscas no está disponible o fue removida."
      showBackButton={false}
    />
  )
}
