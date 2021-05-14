// ==UserScript==
// @name         Nemlig macronutrients
// @namespace    https://www.nemlig.com/
// @version      1.0.8
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
    if (document.querySelector('table.table') != null && document.querySelector('table.table + div.macros') == null) {
      addInfo()
    }
  }, 250)
}

function addInfo() {
  let decs = Array.from(document.querySelectorAll('table.table tr.table__row')).map((e) => Array.from(e.querySelectorAll('td.table__col')).map((e) => e.innerText.trim()))
  let kcal = processDec(decs.find(([k, v]) => k === 'Energi')[1] ?? '')
  let carb = processDec(decs.find(([k, v]) => k === 'Kulhydrat')[1] ?? '')
  let protein = processDec(decs.find(([k, v]) => k === 'Protein')[1] ?? '')
  let fat = processDec(decs.find(([k, v]) => k === 'Fedt')[1] ?? '')

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

  document.querySelector('table.table').parentElement.append(generateStatsHtml(macros))

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
    statsElement.innerHTML = createStat('Carbs', macros.carbs, '#E3D3A3') + createStat('Proteins', macros.proteins, '#926C96') + createStat('Fats', macros.fats, '#74968E')

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
