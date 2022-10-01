import { Macronutrient, MacronutrientEnergyDensity } from '../constant'
import { parseNutrientDeclarations } from '../util'

export function renderMacronutrients() {
  let nutritionDeclarations = parseNutrientDeclarations()
  if (nutritionDeclarations == null) return null

  let itemEnergy = nutritionDeclarations.energy?.kcal
  let itemCarbohydrate = nutritionDeclarations.carbohydrate?.total
  let itemFat = nutritionDeclarations.fat?.total
  let itemProtein = nutritionDeclarations?.protein
  if (
    itemEnergy == null ||
    itemCarbohydrate == null ||
    itemFat == null ||
    itemProtein == null
  )
    return null

  const totalMacronutrientEnergy =
    itemCarbohydrate * MacronutrientEnergyDensity.CARBOHYDRATE +
    itemProtein * MacronutrientEnergyDensity.PROTEIN +
    itemFat * MacronutrientEnergyDensity.FAT

  let macros = {
    carbohydrate: calculateMacro(Macronutrient.CARBOHYDRATE, itemCarbohydrate),
    fat: calculateMacro(Macronutrient.FAT, itemFat),
    protein: calculateMacro(Macronutrient.PROTEIN, itemProtein),
  }
  // Correct pct inconsistencies
  const totalPct = macros.carbohydrate.pct + macros.protein.pct + macros.fat.pct
  if (totalPct !== 100) {
    macros.fat.pct -= totalPct - 100
  }

  return `
<div class="macros" style="display: grid; grid-auto-flow: column; gap: 16px; justify-content: center; align-items: center; width: 100%;">
  ${
    generateMacroStatHTML('Carb', macros.carbohydrate, '#E3D3A3') +
    generateMacroStatHTML('Protein', macros.protein, '#926C96') +
    generateMacroStatHTML('Fat', macros.fat, '#74968E')
  }
</div>
`

  function calculateMacro(macro: Macronutrient, macroAmount: number) {
    return {
      energy: Math.round(macroAmount * MacronutrientEnergyDensity[macro]),
      pct: Math.round(
        ((macroAmount * MacronutrientEnergyDensity[macro]) /
          totalMacronutrientEnergy) *
          100
      ),
    }
  }

  function generateMacroStatHTML(
    name: string,
    macro: ReturnType<typeof calculateMacro>,
    color: string
  ) {
    const flexCenter =
      'display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;'
    const size = 80
    const doughnutWidth = 2
    const conicGradient = `background: conic-gradient(${color}ff ${Math.round(
      (macro.pct / 100) * 360
    )}deg, ${color}20 0deg);`

    return `
<div style="${flexCenter} width: ${size}px; height: ${size}px; border-radius: 50%; ${conicGradient}">
  <div style="${flexCenter} width: ${size - doughnutWidth * 2}px; height: ${
      size - doughnutWidth * 2
    }px; background-color: white; border-radius: 50%;">
    <span style="font-size: 12px;">${name}</span>
    <span style="font-size: 16px; font-weight: 600;">${macro.pct}%</span>
    <span style="font-size: 12px; color: #aaa;">${macro.energy} kcal</span>
  </div>
</div>
`
  }
}
