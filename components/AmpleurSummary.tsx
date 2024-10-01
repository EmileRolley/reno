import { Labels } from '@/app/LandingUI'
import Link from 'next/link'
import { formatValue } from 'publicodes'
import { SummaryAide } from './SummaryAide'
import addIcon from '@/public/add-circle-stroke.svg'
import removeIcon from '@/public/remove-circle-stroke.svg'
import Image from 'next/image'

import { CTA, CTAWrapper, Card } from './UI'

import { PrimeStyle } from './UI'
import rules from '@/app/règles/rules'
import { push } from '@socialgouv/matomo-next'

const topList = rules['ampleur . tous les dispositifs'].somme,
  // unfold the sums with one level only, no recursion yet
  list = topList
    .map((dottedName) => {
      const rule = rules[dottedName]
      if (rule.somme) return rule.somme
      return dottedName
    })
    .flat()
    .map((dottedName) => {
      const rule = rules[dottedName]
      const split = dottedName.split(' . montant')
      if (split.length > 1) {
        const parentRule = rules[split[0]]
        return {
          ...rule,
          dottedName,
          icône: parentRule.icône,
          marque: parentRule.marque,
          'complément de marque': parentRule['complément de marque'],
          type: parentRule['type'],
        }
      }
      return { ...rule, dottedName }
    })

export default function AmpleurSummary({
  engine,
  url,
  situation,
  expanded,
  setSearchParams,
}) {
  const extremeSituation = { ...situation, 'projet . travaux': 999999 }

  const evaluation = engine
    .setSituation(extremeSituation)
    .evaluate('ampleur . montant')

  const value = formatValue(evaluation, { precision: 0 })

  const eligible = !(
    value === 'Non applicable' ||
    evaluation.nodeValue === 0 ||
    value === 'non'
  )

  const aides = list.map((aide) => {
    const evaluation = engine
      .setSituation(extremeSituation)
      .evaluate(aide.dottedName)
    const value = formatValue(evaluation, { precision: 0 })

    const eligible = !(
      value === 'Non applicable' ||
      evaluation.nodeValue === 0 ||
      value === 'non'
    )
    return { ...aide, evaluation, value, eligible }
  })

  const aidesEligibles = aides.filter((a) => a.eligible)
  const aidesNonEligibles = aides.filter((a) => !a.eligible)

  const expand = () =>
    setSearchParams({ details: expanded ? undefined : 'oui' })

  return (
    <section>
      <header>
        <h3>Faire une rénovation d'ampleur</h3>
        <ProfessionnelLabel />
        <p
          css={`
            margin-top: 1.4rem;
          `}
        >
          Un programme sur-mesure pour gagner au minimum{' '}
          deux&nbsp;classes&nbsp;DPE.
        </p>
      </header>

      <Card
        css={`
          /* if nothing's active, grayscale the font ?
		  */
          margin-top: 0.2rem;
          background: white;
          padding-top: 1.2rem;
          max-width: 40rem;
        `}
      >
        {aidesEligibles.map((aide) => (
          <SummaryAide
            key={aide.dottedName}
            {...{
              ...aide,
              icon: aide.icône,
              text: aide.marque,
              text2: aide['complément de marque'],
              type: aide.type,
              expanded,
            }}
          />
        ))}

        <div
          css={`
            margin-top: 1.6rem;
            display: flex;
            align-items: center;
            justify-content: end;
            span {
              margin: 0 0.15rem;
            }
          `}
        >
          <span>
            {expanded ? (
              <span>
                <strong>Au total</strong> jusqu'à
              </span>
            ) : (
              <span>Jusqu'à</span>
            )}
          </span>
          <PrimeStyle>{value}</PrimeStyle>
        </div>

        <button
          css={`
            border: none;
            background: none;
            text-align: right;
            display: block;
            margin: 0 0 0 auto;
            color: gray;
            img {
              filter: grayscale(1);
            }
          `}
        >
          <small onClick={() => expand()}>
            {expanded ? (
              <span>
                <Image src={removeIcon} alt="Icône signe moins entouré" />{' '}
                Cacher
              </span>
            ) : (
              <span>
                <Image src={addIcon} alt="Icône signe plus entouré" /> Voir
              </span>
            )}{' '}
            les montants aide par aide
          </small>
        </button>

        <div
          css={`
            visibility: visible;
            & > div {
              margin-bottom: 0.3rem;
              margin-top: 1rem;
            }
          `}
        >
          <CTAWrapper $justify="end">
            <CTA $fontSize="normal">
              <Link
                href={url}
                onClick={() =>
                  push([
                    'trackEvent',
                    'Simulateur Principal',
                    'Clic',
                    'parcours ampleur',
                  ])
                }
              >
                Découvrir le détail
              </Link>
            </CTA>
          </CTAWrapper>
          <p
            css={`
              display: flex;
              justify-content: end;
              color: #666;
              font-size: 90%;
            `}
          >
            MaPrimeRénov' Parcours Accompagné
          </p>
        </div>

        {aidesNonEligibles.map((aide) => (
          <SummaryAide
            key={aide.dottedName}
            {...{
              ...aide,
              icon: aide.icône,
              text: aide.marque,
              text2: aide['complément de marque'],
              type: aide.type,
              expanded,
            }}
          />
        ))}
      </Card>
    </section>
  )
}
export const ProfessionnelLabel = () => (
  <Labels
    $color={'#6E4444'}
    $background={'#fdf8db'}
    css={`
      margin-top: 0.3rem;
    `}
  >
    {['🤝 Un professionnel vous accompagne'].map((text) => (
      <li key={text}>{text}</li>
    ))}
  </Labels>
)
