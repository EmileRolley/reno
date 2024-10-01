'use client'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import css from '@/components/css/convertToJs'
import DynamicHeaderIcon from '@/app/DynamicHeaderIcon'
import { HeaderWrapper, Title } from '@/app/LayoutUI'
import useIsInIframe, { useIsCompact } from '@/components/useIsInIframe'
import { usePathname } from 'next/navigation'

export default function Header() {
  const isInIframe = useIsInIframe()
  const isCompact = useIsCompact()
  const pathname = usePathname()
  const isBareIframe = pathname === '/module/integration' || (isInIframe && isCompact)

  if (isBareIframe) return null
  return (
    <HeaderWrapper>
      <nav>
        <Link
          href="/"
          style={css`
            text-decoration: none;
            color: inherit;
          `}
          target={isInIframe ? '_blank' : undefined}
        >
          <div
            style={css`
              display: flex;
              align-items: center;
            `}
          >
            <DynamicHeaderIcon />
            <div
              style={css`
                display: flex;
                align-items: center;
                margin-left: 1vw;
              `}
            >
              <Image
                src={logo}
                alt="Logo Mes Aides Réno, représentant une maison bleu blanc rouge"
              />
              <Title>
                Mes <strong>Aides Réno</strong>
              </Title>
              <strong
                title="Les résultats présentés sur ce site sont une simulation, en version beta : elle est à but d'information mais peut contenir des erreurs. Elle ne remplace ni la loi, ni les informations présentées sur https://france-renov.gouv.fr, ni les conseillers France Rénov'"
                style={css`
                  background: #e8edff;
                  color: #0063cb;
                  padding: 0.1rem 0.3rem;
                  border-radius: 0.1rem;
                  margin-left: 0.6rem;
                  font-size: 110%;
                `}
              >
                BETA
              </strong>
            </div>
          </div>
        </Link>
        <div>
          <Link href="/blog">Blog</Link>
          <Link href="/aides">Les aides</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/devenir-partenaire">Devenir Partenaire</Link>
        </div>
      </nav>
    </HeaderWrapper>
  )
}

