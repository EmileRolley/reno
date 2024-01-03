import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'
import { getRuleName } from './publicodes/utils'

export const isMosaicQuestion = (currentQuestion, rule, rules) => {
  const localIsMosaic = (dottedName, rule) =>
    dottedName.startsWith('gestes . ') &&
    rule &&
    ['oui', 'non'].includes(rule['par défaut'])
  if (!localIsMosaic(currentQuestion, rule)) return false

  const questions = Object.entries(rules).filter(([dottedName, rule]) =>
    localIsMosaic(dottedName, rule),
  )
  return questions
}

export const mosaicQuestionText = (rules, currentQuestion) => {
  return rules['gestes . montant'].question.mosaïque
}
export default function BooleanMosaic({
  rules,
  setSearchParams,
  rule,
  engine,
  situation,
  answeredQuestions,
  questions,
}) {
  const grouped = questions.reduce(
    (memo, [q, rule]) => {
      const categoryDottedName = q.split(' . ').slice(0, -1).join(' . ')

      return {
        ...memo,
        [categoryDottedName]: [...(memo[categoryDottedName] || []), q],
      }
    },

    {},
  )

  console.log('grouped', grouped)
  return (
    <div>
      <fieldset
        style={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        <ul>
          {Object.entries(grouped).map(([categoryName, questions]) => {
            const categoryTitle = rules[categoryName].titre

            console.log('QUES', questions)
            return (
              <li key={categoryName}>
                <h4>{categoryTitle}</h4>
                {questions.map((dottedName) => {
                  const questionRule = rules[dottedName]
                  return (
                    <label
                      key={dottedName}
                      style={css`
                        margin: 0 1rem;
                        width: 16rem;
                      `}
                    >
                      <input
                        style={css`
                          margin-right: 1rem;
                        `}
                        type="checkbox"
                        checked={situation[dottedName] === 'oui'}
                        value={Math.random() > 0.5 ? true : false}
                        onChange={() => {
                          const encodedSituation = encodeSituation(
                            {
                              ...situation,
                              [dottedName]:
                                situation[dottedName] === 'oui' ? 'non' : 'oui',
                            },
                            false,
                            answeredQuestions,
                          )
                          console.log(
                            'on change will set encodedSituation',
                            encodedSituation,
                          )

                          setSearchParams(encodedSituation, false, false)
                          console.log('set situation', dottedName)
                        }}
                      />
                      {questionRule.titre || getRuleName(dottedName)}
                    </label>
                  )
                })}
              </li>
            )
          })}
        </ul>
      </fieldset>
    </div>
  )
}