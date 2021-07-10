// ==UserScript==
// @name         Nemlig macronutrients
// @namespace    https://www.nemlig.com/
// @version      1.0.9
// @description  Add macronutrient info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @match        https://www.nemlig.com/*
// @grant        none
// ==/UserScript==

run()

function run() {
  setInterval(() => {
    if (shouldRenderMacros()) {
      renderMacros()
    }
  }, 250)
}

function renderMacros() {
  let decs = parseNutrients()
  let kcal = decs.energy.kcal
  let carb = decs.carbohydrate.total
  let fat = decs.fat.total
  let protein = decs.protein

  if (kcal === 0) return null

  let macros = {
    carbs: calculateMacro(carb, 4),
    proteins: calculateMacro(protein, 4),
    fats: calculateMacro(fat, 9),
  }
  // Correct pct inconsistencies
  const totalPct = macros.carbs.pct + macros.proteins.pct + macros.fats.pct
  if (totalPct !== 100) {
    macros.fats.pct -= totalPct - 100
  }

  document.querySelector('product-detail-declaration table.table').parentElement.append(generateStatsHtml(macros))

  function calculateMacro(macroAmount, kcalRatio) {
    let total = carb * 4 + protein * 4 + fat * 9

    return {
      kcal: Math.round(macroAmount * kcalRatio),
      pct: Math.round(((macroAmount * kcalRatio) / total) * 100),
    }
  }

  function processDec(dec) {
    const value = dec.replace(/^.*?([\d,]+)\D+$/, '$1')
    return Number((value ?? '').replace(/,/, '.'))
  }

  function generateStatsHtml(macros) {
    const flexCenter = 'display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;'

    const statsElement = document.createElement('div')
    statsElement.classList.add('macros')
    statsElement.style = 'display: grid; grid-auto-flow: column; gap: 16px; justify-content: center; align-items: center; width: 100%;'
    statsElement.innerHTML =
      createStat('Carbs', macros.carbs, '#E3D3A3') + createStat('Proteins', macros.proteins, '#926C96') + createStat('Fats', macros.fats, '#74968E')

    return statsElement

    function createStat(name, macro, color) {
      let size = 80
      let doughnutWidth = 2
      let conicGradient = `background: conic-gradient(${color}ff ${Math.round((macro.pct / 100) * 360)}deg, ${color}20 0deg);`

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
}

function shouldRenderMacros() {
  return document.querySelector('product-detail-declaration table.table tr.table__row') != null && document.querySelector('div.macros') == null
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
    return v != null ? Number(String(v).replace(/[^0-9,.]/gi, '').replace(/,/gi, '.')) : undefined
  }
}
