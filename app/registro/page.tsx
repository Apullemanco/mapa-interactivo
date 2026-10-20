import type { Metadata } from 'next'
import { RegistrationForm } from '@/components/registration-form'

export const metadata: Metadata = {
  title: 'Origen de la comunidad · Jardín de las Carreras',
  description: 'Registra la ciudad de origen de nuestra comunidad estudiantil.'
}

export default function RegistroPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 px-5 py-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Jardín de las Carreras
        </p>
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-balance">
          Marca tu origen en el mapa
        </h1>
        <p className="leading-relaxed text-muted-foreground text-pretty">
          Toca directamente el lugar de donde vienes para marcarlo. No guardamos datos personales.
        </p>
      </header>
      <RegistrationForm />
    </main>
  )
}
