import Feedback from '@/app/contact/Feedback'
import { No } from '@/components/ResultUI'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import CopyButton from './CopyButton'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import { Card, CTA, CTAWrapper, Section } from './UI'
import { useAides } from './ampleur/useAides'
import { decodeDottedName, encodeSituation } from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import * as iframe from '@/utils/iframe'
import { useEffect } from 'react'
import { getTravauxEnvisages, isCategorieChecked } from './ChoixTravaux'
import AideAmpleur from './ampleur/AideAmpleur'
import { correspondance } from '@/app/simulation/Form'
import AidesAmpleur from './ampleur/AidesAmpleur'
import Breadcrumb from './Breadcrumb'
import AideGeste from './AideGeste'
import Link from 'next/link'
import DPEScenario from './mpra/DPEScenario'

export default function Eligibility({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  expanded,
  searchParams,
  consent = false,
  sendDataToHost = false,
}) {
  push(['trackEvent', 'Simulateur Principal', 'Page', 'Eligibilité'])
  const isInIframe = useIsInIframe()
  const aides = useAides(engine, situation)
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  const hasMPRA =
    aides.find((aide) => aide.baseDottedName == 'MPR . accompagnée').status ===
    true
  const showPersonaBar = searchParams.personas != null

  const travauxEnvisages = getTravauxEnvisages(situation)
  const travauxConnus = situation['projet . définition'] != '"travaux inconnus"'

  useEffect(() => {
    if (isInIframe && sendDataToHost) {
      iframe.postMessageEligibilityDone(consent ? situation : {})
    }
  }, [isInIframe, consent, situation])

  return (
    <Section
      css={`
        ${showPersonaBar && `margin-top: 4rem`}
        h2 {
          color: var(--color);
          font-size: 120%;
        }
        h3 {
          font-weight: normal;
        }
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <CustomQuestionWrapper>
        <Breadcrumb
          links={[
            {
              Eligibilité: setSearchParams(
                {
                  ...encodeSituation(situation, false, answeredQuestions),
                },
                'url',
                true,
              ),
            },
          ]}
        />
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <BackToLastQuestion
            {...{ setSearchParams, situation, answeredQuestions }}
          />
          <CopyButton searchParams={searchParams} />
        </div>
        <header>
          <h1>Vos résultats</h1>
          <p
            css={`
              margin: 0.5rem 0 !important;
            `}
          >
            {hasMPRA && (
              <>
                <span aria-hidden="true">🥳</span> Vous êtes éligible aux aides
                présentées ci-dessous :
              </>
            )}
            {!hasAides && (
              <>
                Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
                éligible.
              </>
            )}
            {!hasMPRA && (
              <>
                <span aria-hidden="true">🥳</span> Des prêts et des aides sont
                disponibles pour vos travaux
              </>
            )}
          </p>
          {hasAides && !hasMPRA && (
            <p>
              Si vous n’avez pas encore de plan de travaux, vous pouvez
              construire votre projet avec un conseiller France Rénov’.
            </p>
          )}
        </header>
        <h2>
          <span aria-hidden="true">💶</span> Aides pour vos travaux
        </h2>
        {Object.entries({
          isolation: 'Isolation thermique',
          ventilation: 'Ventilation',
          chauffage: 'Chauffage',
          solaire: 'Solutions solaires',
        }).map((category) => {
          return (
            <div key={category}>
              {isCategorieChecked(category[0], travauxEnvisages) && (
                <>
                  <h4>{category[1]}</h4>
                  {category[0] == 'isolation' && (
                    <p>Murs, toit, plancher, portes et fenêtres</p>
                  )}
                  {travauxEnvisages
                    .filter(
                      (travaux) =>
                        travaux.includes(category[0]) &&
                        rules[decodeDottedName(travaux) + ' . montant'], // Pour éviter qu'on ait la catégorie qui ressorte (ex: gestes . chauffage . PAC)
                    )
                    .map((travaux) => {
                      return (
                        <div key={travaux}>
                          <AideGeste
                            {...{
                              engine,
                              dottedName: decodeDottedName(travaux),
                              setSearchParams,
                              answeredQuestions,
                              situation,
                            }}
                          />
                        </div>
                      )
                    })}
                </>
              )}
            </div>
          )
        })}
        {hasMPRA && (
          <Card
            css={`
              background: #f4efff;
              padding: calc(0.5rem + 1vw);
              > strong {
                font-size: 120%;
              }
              ul {
                list-style-type: none;
                padding: 1rem 0;
                li {
                  padding: 0.2rem 0;
                }
              }
            `}
          >
            <strong>
              {travauxConnus
                ? 'Avez-vous pensé à une rénovation plus ambitieuse ?'
                : "Vous êtes éligible à une subvention pour réaliser une rénovation d'ampleur :"}
            </strong>
            <ul>
              <li>📉 Réduction des factures d'énergie</li>
              <li>🧘 Gain de confort hiver comme été</li>
              <li>
                👷 <strong>Mon accompagnateur rénov'</strong> assure le suivi
              </li>
              <li>
                🥇 Au moins <strong>60%</strong> des travaux financés
              </li>
            </ul>
            <div
              css={`
                border-bottom: 1px solid var(--lighterColor2);
                margin-bottom: 1rem;
                padding-left: 1.5rem;
                h3 {
                  font-size: 90%;
                }
              `}
            >
              <AideAmpleur
                {...{
                  isEligible: false,
                  engine,
                  dottedName: 'MPR . accompagnée',
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  expanded,
                  addedText: (
                    <DPEScenario
                      {...{
                        rules,
                        engine,
                        situation,
                        setSearchParams,
                        answeredQuestions,
                      }}
                    />
                  ),
                }}
              />
            </div>
          </Card>
        )}
        <AidesAmpleur
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            engine,
            rules,
            searchParams,
            correspondance,
          }}
        />
        {!hasMPRA && (
          <>
            <h4>Et maintenant ?</h4>
            <p>Un conseiller France Rénov’ peut vous aider à :</p>
            <ul
              css={`
                list-style-type: none;
                padding: 0;
                margin-bottom: 2rem;
              `}
            >
              <li>🛠️ Identifier les bons travaux à faire</li>
              <li>💰 Monter un plan de financement adapté</li>
              <li>
                🎯 Accéder aux aides auxquelles vous aurez droit au moment du
                projet
              </li>
            </ul>
          </>
        )}
        {isInIframe ? null : <Feedback />}
        <ObtenirAideBaniere
          {...{
            setSearchParams,
            isVisible: true,
            link: setSearchParams({ objectif: 'etape' }, 'url'),
          }}
        />
      </CustomQuestionWrapper>
    </Section>
  )
}

export const ObtenirAideBaniere = ({
  isVisible,
  label = 'Obtenir mes aides',
  link,
}) => {
  return (
    <div
      css={`
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--color);
        color: white;
        padding: 0;
        border-top: 1px solid #ddd;
        text-align: center;
        z-index: 1000;
        transform: translateY(${isVisible ? '0%' : '100%'});
        transition: transform 0.5s ease-in-out;
      `}
    >
      <CTAWrapper $justify="center">
        <CTA $fontSize="normal">
          <Link href={link}>{label}</Link>
        </CTA>
      </CTAWrapper>
    </div>
  )
}
