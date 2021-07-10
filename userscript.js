// ==UserScript==
// @name         Nemlig Extended Nutrient Info
// @namespace    https://www.nemlig.com/
// @version      2.1.1
// @description  Add extra nutrition info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @match        https://www.nemlig.com/*
// @grant        none
// ==/UserScript==

const AdvisoryLevel = {
  VERY_BAD: '😱',
  BAD: '😰',
  NEUTRAL: '🙂',
  GOOD: '😋',
  VERY_GOOD: '😍',
}

const dailyIntake = {
  energy: 2500,
  saturatedFat: (energy, saturatedFat) => {
    const energyPart = energy / 2500
    const threshold = (pct) => (2500 / 9) * pct

    if (saturatedFat > energyPart * threshold(0.15)) return { level: AdvisoryLevel.VERY_BAD, message: 'Very high in saturated fat' }
    else if (saturatedFat > energyPart * threshold(0.10)) return { level: AdvisoryLevel.BAD, message: 'High in saturated fat' }
  },
  sugar: (energy, sugar) => {
    const energyPart = energy / 2500
    const threshold = (pct) => (2500 / 4) * pct

    if (sugar > energyPart * threshold(0.15)) return { level: AdvisoryLevel.VERY_BAD, message: 'Very high in sugar' }
    else if (sugar > energyPart * threshold(0.1)) return { level: AdvisoryLevel.BAD, message: 'High in sugar' }
  },
  dietaryFiber: (energy, dietaryFiber) => {
    const energyPart = energy / 2500
    const threshold = (pct) => (2500 / 250) * 3 * pct

    if (dietaryFiber > energyPart * threshold(1.25)) return { level: AdvisoryLevel.VERY_GOOD, message: 'Very high in fiber' }
    else if (dietaryFiber > energyPart * threshold(1)) return { level: AdvisoryLevel.GOOD, message: 'High in fiber' }
  },
  salt: (energy, salt) => {
    const energyPart = energy / 2500

    if (salt > energyPart * 8) return { level: AdvisoryLevel.VERY_BAD, message: 'Very high in salt' }
    else if (salt > energyPart * 6) return { level: AdvisoryLevel.BAD, message: 'High in salt' }
  },
}

run()

function run() {
  setInterval(() => {
    render()
  }, 250)
}

function shouldRender() {
  return document.querySelector('product-detail-declaration table.table tr.table__row') != null && document.querySelector('div.macros') == null
}

function render() {
  if (!shouldRender()) return null

  const containerElement = document.createElement('div')
  containerElement.id = 'ExtNutriInfoContainer'
  containerElement.style = [
    'position: fixed',
    `z-index: 10`,
    'bottom: 0',
    'left: 8px',
    'border-radius: 4px 4px 0 0',
    'padding: 16px 20px 24px',
    'width: 296px',
    'background-color: white',
    'box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px',
  ].join('; ')

  containerElement.innerHTML = [generateAdvisorHTML(), generateMacrosHTML()]
    .filter(Boolean)
    .join('<hr style="margin: 16px auto; border: none; border-top: 1px solid lightgrey; width: 80%;" />')

  document.querySelector('product-detail').append(containerElement)
}

function generateAdvisorHTML() {
  let decs = parseNutrients()

  let advisories = [
    dailyIntake.saturatedFat(decs.energy.kcal, decs.fat.saturated),
    dailyIntake.dietaryFiber(decs.energy.kcal, decs.carbohydrate.dietaryFiber),
    dailyIntake.sugar(decs.energy.kcal, decs.carbohydrate.sugar),
    dailyIntake.salt(decs.energy.kcal, decs.salt),
  ].filter(Boolean)

  const listHtml = generateListHTML(advisories)

  return listHtml !== ''
    ? `<div id="ExtNutriInfoAsvisorContainer" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 8px;"> ${listHtml} </div>`
    : null

  function generateListHTML(list, bullet) {
    return list
      .map(({ level, message }) => {
        return `<span>${level} ${message}</span>`
      })
      .join('')
  }
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

  let energyValues = decs.energi
    .split('/')
    .map(processValue)
    .sort((a, b) => a - b)

  return {
    ...processResEntry('energy', {
      ...processResEntry('kcal', energyValues[0]),
      ...processResEntry('kj', energyValues[1]),
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
