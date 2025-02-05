import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { CTA, ExternalLink, PrimeStyle } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0 } from '../utils'
import AideCTAs from './AideCTAs'
import styled from 'styled-components'
import { formatValue } from 'publicodes'
import FatConseiller from '../FatConseiller'
import conseillerIcon from '@/public/conseiller.png'
import AideDurée from './AideDurée'
import { createExampleSituation } from './AmpleurSummary'
import { useEffect, useRef, useState } from 'react'
import FatConseillerCTA from '../FatConseillerCTA'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { FatConseillerWrapper } from '../FatConseillerUI'

export default function AideAmpleur({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
  children,
  expanded,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenConseiller, setIsOpenConseiller] = useState(false)
  const contentRef = useRef(null)
  useEffect(() => {
    if (!expanded && contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
    }
  }, [isOpen])
  return (
    <section
      id={'aide-' + encodeDottedName(dottedName)}
      css={`
        ${!expanded && 'border-bottom: 1px solid var(--lighterColor2);'}
        margin-bottom: 1rem;
      `}
    >
      <header
        css={`
          margin: 0 0 1rem 0;
          font-size: 130%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            ${!expanded && 'cursor: pointer;'}
          }
        `}
        onClick={() => !expanded && setIsOpen(!isOpen)}
      >
        <div>
          {expanded ? (
            <h1
              css={`
                margin: 0 0 0.5rem 0;
              `}
            >
              {aideTitle(dottedName)}
            </h1>
          ) : (
            <h3
              css={`
                margin: 0 0 0.5rem 0;
                color: var(--color);
              `}
            >
              {aideTitle(dottedName)}
            </h3>
          )}
          <PrimeWithLabel
            {...{
              engine,
              situation,
              dottedName: dottedName + ' . montant',
            }}
          />
        </div>
        {!expanded && (
          <div
            css={`
              &::after {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                border-bottom: 2px solid var(--color);
                border-right: 2px solid var(--color);
                transform: rotate(${isOpen ? '225deg' : '45deg'});
                transition: transform 0.3s ease-in-out;
              }
            `}
          />
        )}
      </header>
      <div
        ref={contentRef}
        css={`
          ${!expanded && 'max-height: 0;'}
          opacity: ${isOpen || expanded ? '1' : '0'};
          overflow: hidden;
          transition:
            max-height 0.4s ease-out,
            opacity 0.3s ease-out;
        `}
      >
        {expanded && (
          <strong>
            De quoi s’agit-il ?<span aria-hidden="true">🤓</span>
          </strong>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        {!expanded && (
          <AideCTAs
            {...{
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
              expanded,
            }}
          />
        )}
      </div>
      {expanded && (
        <>
          {children}
          {dottedName != 'ampleur . prime individuelle copropriété' && (
            <p
              css={`
                margin-top: 1.6rem;
              `}
            >
              <ExternalLink href={rules[dottedName]['lien']} target="_blank">
                Plus d'infos sur cette aide
              </ExternalLink>
            </p>
          )}
          <CTA
            css={`
              padding: 1rem;
              text-wrap: wrap;
              text-align: center;
              margin: auto;
              margin-bottom: 1rem;
              cursor: pointer;
            `}
            $fontSize="normal"
            onClick={() => {
              setIsOpenConseiller(!isOpenConseiller)
              push([
                'trackEvent',
                'Simulateur Principal',
                'Clic',
                'trouver conseiller',
              ])
            }}
          >
            Trouver mon conseiller local
          </CTA>
          {isOpenConseiller && (
            <div
              css={`
                display: flex;
                justify-content: space-around;
                gap: 1rem;
                align-items: center;
                background: var(--lightestColor);
                padding: 1rem;
                margin-bottom: 1rem;
                border: 1px solid #d0d0ed;
                h3 {
                  margin: 0 0 1rem 0;
                }
              `}
            >
              <Image
                src={conseillerIcon}
                alt="illustration espace conseiller France Rénov'"
                width="200"
              />
              <div>
                <h3>
                  Contacter votre conseiller <span>France&nbsp;Rénov'</span>
                </h3>
                <ul>
                  <li>Service indépendant, neutre et gratuit !</li>
                  <li>Conseils personnalisés pour votre projet</li>
                </ul>
                <MarSearch
                  situation={situation}
                  what={'trouver-conseiller-renov'}
                />
              </div>
            </div>
          )}
          {/* <FatConseiller
            {...{
              situation,
              margin: 'small',
              texte: rules[dottedName].commentFaireHtml,
            }}
          /> */}
          <AideCTAs
            {...{
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
              expanded,
            }}
          />
        </>
      )}
    </section>
  )
}

export const PrimeWithLabel = ({ engine, dottedName, situation }) => {
  const bestSituation = createExampleSituation(engine, situation, 'best')
  const worstSituation = createExampleSituation(engine, situation, 'worst')
  const montantMax = engine.setSituation(bestSituation).evaluate(dottedName)
  const montantMin = engine.setSituation(worstSituation).evaluate(dottedName)

  return montantMax.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
    >
      {dottedName.includes('taxe foncière') ? (
        <strong>{situation['taxe foncière . commune . taux']}</strong>
      ) : montantMax.nodeValue == montantMin.nodeValue ? (
        <>
          {rules[dottedName.replace(' . montant', '')].type == 'prêt'
            ? "Jusqu'à"
            : 'Prime de'}{' '}
          <strong>{formatValue(montantMin)}</strong>
        </>
      ) : (
        <>
          De <strong>{formatValue(montantMin)}</strong> à{` `}
          <strong>{formatValue(montantMax)}</strong>
        </>
      )}
      <AideDurée engine={engine} dottedName={dottedName} />
    </PrimeStyle>
  ) : dottedName != 'aides locales' ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
      $inactive
    >
      Non éligible
    </PrimeStyle>
  ) : (
    ''
  )
}

export const PictoTypeAide = styled.div`
  width: fit-content;
  color: ${(p) => p.$style.color};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .icon {
    padding: 1rem;
    background: url('${(p) => p.$style.icon.src}')
      ${(p) => p.$style.backgroundColor} no-repeat center;
    border: 1px solid ${(p) => p.$style.borderColor};
    border-radius: 5px;
  }
  .type {
    display: inline-block;
    margin-top: 0.3rem;
  }
  span {
    font-size: 60%;
  }
`

export const InformationBlock = ({ children }) => (
  <section
    css={`
      margin-top: 2vh !important;

      header {
        display: flex;
        align-items: center;
        h4 {
          color: #0359bf;
          margin: 0;

          font-weight: 500;
        }
        margin-bottom: 1.5vh !important;
      }
      ol li {
        margin: 0.6rem 0;
        list-style-type: disc;
      }
    `}
  >
    <header>
      <Image
        src={informationIcon}
        width="25"
        css={`
          margin-right: 0.4rem;
        `}
        alt="icone d'information"
      />
      <h4>Informations utiles</h4>
    </header>
    <ol>{children}</ol>
  </section>
)
export function AideCTA({ children, text }) {
  return (
    <details
      css={`
        margin: 1.8rem 0 1rem;
        summary {
          list-style-type: none;
        }
        > section {
          margin: 1rem 0;
          padding-left: 1rem;
          border-left: 2px solid var(--color);
        }
      `}
    >
      <summary>
        <CTA $importance="secondary">
          <span>
            <span
              css={`
                display: flex;
                align-items: center;
                padding: 0.6rem 0;
                img {
                  filter: invert(1);
                  width: 1.8rem;
                  margin-right: 0.6rem;
                  height: auto;
                  vertical-align: bottom;
                }
                color: inherit;
              `}
            >
              {text}
            </span>
          </span>
        </CTA>
      </summary>
      <section>{children}</section>
    </details>
  )
}
export const aideTitle = (dottedName) => {
  const rule = rules[dottedName]
  const marque2 = rule['complément de marque']
  return rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
}
