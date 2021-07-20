import { Allergies } from '../constant'
import { parseIngredients } from '../util'

export function renderAllergy() {
  let ingredients = parseIngredients()
  if (ingredients == null) return null

  let allergies = Object.values(Allergies).filter((a) => a.match(ingredients!))
  if (allergies.length === 0) return null

  const listHtml = allergies
    .map(
      ({ name, icon }) =>
        `
<span style="display: grid; grid-auto-flow: row; grid-gap: 2px; align-items: center; justify-items: center;">
  <span> ${icon} </span>
  <span style="font-weight: bold;"> ${name} </span>
</span>
`
    )
    .join('')
  return listHtml !== ''
    ? `<div id="ExtNutriInfoAllergyContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(20%, 1fr)); grid-gap: 8px;"> ${listHtml} </div>`
    : null
}
