import { AdvisoryLevelIcon } from '../constant'
import { genAdvisories, parseNutrientDeclarations } from '../util'

export function renderAdvisory() {
  let nutritionDeclarations = parseNutrientDeclarations()
  if (nutritionDeclarations == null) return null

  let advisories = genAdvisories(nutritionDeclarations)

  const listHtml = advisories.map(({ level, message }) => `<span>${AdvisoryLevelIcon[level]} ${message}</span>`).join('')
  return listHtml !== ''
    ? `<div id="ExtNutriInfoAsvisorContainer" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 8px;"> ${listHtml} </div>`
    : null
}
