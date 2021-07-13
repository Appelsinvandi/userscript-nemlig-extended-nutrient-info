import { AdvisoryLevelIcon } from '../constant'
import { genAdvisories, parseNutrientDeclarations } from '../util'

export function renderAdvisory() {
  let nutritionDeclarations = parseNutrientDeclarations()
  if (nutritionDeclarations == null) return null

  let advisories = genAdvisories(nutritionDeclarations)

  const listHtml = advisories
    .map(
      ({ level, title, levelText: levelText }) => `
<span style="display: grid; grid-auto-flow: row; grid-gap: 2px; align-items: center; justify-items: center;">
  <span> ${AdvisoryLevelIcon[level]} </span>
  <span style="font-weight: bold;"> ${title} </span>
  <span> ${levelText} </span>
</span>
`
    )
    .join('')
  return listHtml !== ''
    ? `<div id="ExtNutriInfoAdvisorContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(45%, 1fr)); grid-gap: 8px;"> ${listHtml} </div>`
    : null
}
