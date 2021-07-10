// ==UserScript==
// @name         Nemlig macronutrients
// @namespace    https://www.nemlig.com/
// @version      1.0.11
// @description  Add macronutrient info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-extended-nutrient-info/version/1.x.x/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-extended-nutrient-info/version/1.x.x/userscript.js
// @match        https://www.nemlig.com/*
// @grant        none
// ==/UserScript==

run()

function run() {
  setInterval(render, 250)
}

function render() {
  if (!shouldRender()) return null

  const containerElement = document.createElement('div')
  containerElement.innerHTML = generateMacrosHTML()

  document.querySelector('product-detail-declaration table.table').parentElement.append(generateStatsHTML(macros))
}

function shouldRender() {
  return document.querySelector('product-detail-declaration table.table tr.table__row') != null && document.querySelector('div.macros') == null
}

function generateMacrosHTML() {
  let decs = parseNutrients()
  let kcal = decs.energy.kcal
  let carb = decs.carbohydrate.total
  let fat = decs.fat.total
  let protein = decs.protein

  if (kcal === 0) return null

  let macros = { carbs: calculateMacro(carb, 4), proteins: calculateMacro(protein, 4), fats: calculateMacro(fat, 9) }
  // Correct pct inconsistencies
  const totalPct = macros.carbs.pct + macros.proteins.pct + macros.fats.pct
  if (totalPct !== 100) {
    macros.fats.pct -= totalPct - 100
  }

  return `
<div class="macros" style="display: grid; grid-auto-flow: column; gap: 16px; justify-content: center; align-items: center; width: 100%;">
  ${
    generateMacroStatHTML('Carbs', macros.carbs, '#E3D3A3') +
    generateMacroStatHTML('Proteins', macros.proteins, '#926C96') +
    generateMacroStatHTML('Fats', macros.fats, '#74968E')
  }
</div>
`

  function calculateMacro(macroAmount, kcalRatio) {
    let total = carb * 4 + protein * 4 + fat * 9

    return {
      kcal: Math.round(macroAmount * kcalRatio),
      pct: Math.round(((macroAmount * kcalRatio) / total) * 100),
    }
  }

  function generateMacroStatHTML(name, macro, color) {
    const flexCenter = 'display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;'
    const size = 80
    const doughnutWidth = 2
    const conicGradient = `background: conic-gradient(${color}ff ${Math.round((macro.pct / 100) * 360)}deg, ${color}20 0deg);`

    return `
<div style="${flexCenter} width: ${size}px; height: ${size}px; border-radius: 50%; ${conicGradient}">
  <div style="${flexCenter} width: ${size - doughnutWidth * 2}px; height: ${size - doughnutWidth * 2}px; background-color: white; border-radius: 50%;">
    <span style="font-size: 12px;">${name}</span>
    <span style="font-size: 16px; font-weight: 600;">${macro.pct}%</span>
    <span style="font-size: 12px; color: #aaa;">${macro.kcal} kcal</span>
  </div>
</div>
`
  }
}

function parseNutrients() {
  const decsArr = Array.from(document.querySelector('product-detail-declaration table.table').querySelectorAll('tr.table__row'))
    .map((e) => Array.from(e.querySelectorAll('td.table__col')).map((e) => e.innerText.trim().toLowerCase()))
    .filter((e) => e.length === 2)
    .map(([k, v]) => [k.replace(/\s+/gi, '_'), v])
  const decs = Object.fromEntries(decsArr)

  let energyValues = decs.energi.split('/').map(processValue).sort()

  return {
    ...processResEntry('energy', {
      ...processResEntry('kcal', energyValues[1]),
      ...processResEntry('kj', energyValues[0]),
    }),
    ...processResEntry('fat', {
      ...processResEntry('total', decs.fedt),
      ...processResEntry('saturated', decs.heraf_mættede_fedtsyrer),
    }),
    ...processResEntry('carbohydrate', {
      ...processResEntry('total', decs.kulhydrat),
      ...processResEntry('dietaryFiber', decs.kostfibre),
      ...processResEntry('sugar', decs.heraf_sukkerarter),
    }),
    ...processResEntry('protein', decs.protein),
    ...processResEntry('salt', decs.salt),
  }

  function processResEntry(name, value) {
    if (typeof value === 'string' || typeof value === 'number' || value == null) {
      return value != null ? { [name]: processValue(value) } : null
    } else {
      return Object.keys(value).length > 0 ? { [name]: value } : null
    }
  }

  function processValue(v) {
    return v != null
      ? Number(
          String(v)
            .replace(/[^0-9,.]/gi, '')
            .replace(/,/gi, '.')
        )
      : undefined
  }
}
