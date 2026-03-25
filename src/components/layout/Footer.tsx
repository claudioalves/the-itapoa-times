import Link from 'next/link'
import type { Category } from '@/types'

interface FooterProps {
  categories: Category[]
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-bg mt-16">
      <div className="px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl font-black text-bg leading-none tracking-tight mb-3">
              The Itapoá<span className="text-red">.</span>Times
            </div>
            <p className="text-sm text-bg/60 leading-relaxed">
              Jornalismo independente para Itapoá e o litoral norte de Santa Catarina.
            </p>
          </div>

          {/* Editorias */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-bg/40 mb-4">Editorias</div>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/${cat.slug.current}`}
                  className="text-sm text-bg/70 hover:text-bg transition-colors duration-150"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-bg/40 mb-4">Portal</div>
            <div className="flex flex-col gap-1">
              <Link href="/sobre" className="text-sm text-bg/70 hover:text-bg transition-colors duration-150">Sobre</Link>
              <Link href="/contato" className="text-sm text-bg/70 hover:text-bg transition-colors duration-150">Contato</Link>
              <Link href="/anuncie" className="text-sm text-bg/70 hover:text-bg transition-colors duration-150">Anuncie</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-bg/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <span className="text-xs text-bg/40">
            © {year} The Itapoá Times — Todos os direitos reservados
          </span>
          <span className="text-xs text-bg/30">
            Itapoá, SC · Litoral Norte de Santa Catarina
          </span>
        </div>
      </div>
    </footer>
  )
}
