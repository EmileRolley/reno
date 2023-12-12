import Travaux from './Travaux'
import { Key, P } from './ExplicationUI'
import css from '../css/convertToJs'
import { correspondance } from '../DPESelector'

export default function Explication(props) {
  const { engine, rules, situation } = props
  const upEngine = engine.setSituation(situation)

  const revenuClasse = upEngine.evaluate('revenu . classe'),
    revenuMissing = Object.entries(revenuClasse.missingVariables).map(
      ([k, v]) => rules[k],
    ),
    hasRevenuMissing = revenuMissing.length > 0
  console.log(revenuClasse)

  const idf = upEngine.evaluate('région . IdF').nodeValue

  const sauts = upEngine.evaluate('sauts'),
    sautsMissing = sauts.missingVariables,
    hasSautsMissing = Object.entries(sautsMissing).length > 0,
    dpeFrom = upEngine.evaluate('DPE . actuel'),
    dpeTo = upEngine.evaluate('DPE . visé')

  return (
    <section
      style={css`
        margin-bottom: 2rem;
      `}
    >
      <h2>Explications</h2>
      <h3>Votre classe de revenu</h3>
      <P>
        Votre revenue est {hasRevenuMissing ? <em>temporairement</em> : ''} dans
        la classe dite{' '}
        <Key $state={hasRevenuMissing ? 'inProgress' : 'final'}>
          {revenuClasse.nodeValue}
        </Key>
        {idf ? <span>(barème Île-de-France)</span> : ''}
        {revenuMissing.length ? (
          <span>
            , en attendant les informations suivantes :{' '}
            {revenuMissing.map((el) => (
              <>
                <Key $state={'null'}>{el.titre.toLowerCase()}</Key>
                <span> </span>
              </>
            ))}
          </span>
        ) : (
          ''
        )}
        .
      </P>
      {!hasSautsMissing && (
        <div>
          <h3>L'amélioration de votre DPE</h3>
          <P>
            Votre projet prévoit <Key $state="final">{sauts.nodeValue}</Key>{' '}
            sauts de classe DPE (de {correspondance[dpeFrom.nodeValue]} à{' '}
            {correspondance[dpeTo.nodeValue]}
            ).
          </P>
        </div>
      )}
      <Travaux {...props} />
    </section>
  )
}