// ==UserScript==
// @name         Nemlig macronutrients
// @namespace    https://www.nemlig.com/
// @version      1.0.3
// @description  Add macronutrient info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @include      /^https?:\/\/www\.nemlig\.com\/.*-\d+$/
// @grant        none
// ==/UserScript==

let decs = contentAsJson.content[0].Declarations;
let kcal = processDec(decs.EnergyKcal);
let carb = processDec(decs.NutritionalContentCarbohydrate);
let fat = processDec(decs.NutritionalContentFat);
let protein = processDec(decs.NutritionalContentProtein);

run();

async function run() {
  if (kcal === 0) return null;

  let macros = {
    carbs: calculateMacro(carb, 4),
    proteins: calculateMacro(protein, 4),
    fats: calculateMacro(fat, 9),
  };
  // Correct pct inconsistencies
  const totalPct = macros.carbs.pct + macros.proteins.pct + macros.fats.pct
  if (totalPct !== 100) {
    macros.fats.pct -= totalPct - 100
  }

  let anchorPoint = null;
  while (anchorPoint == null) {
    anchorPoint = document.querySelector("table.table");
    if (anchorPoint == null) {
      await new Promise((res) => setTimeout(res, 100)); // wait 100 ms
    }
  }
  anchorPoint.parentElement.append(generateStatsHtml(macros));
}


function calculateMacro(macroAmount, kcalRatio) {
  let total = (carb * 4) + (protein * 4) + (fat * 9);

  return {
    kcal: Math.round(macroAmount * kcalRatio),
    pct: Math.round(((macroAmount * kcalRatio) / total) * 100),
  };
}

function processDec(dec) {
  return Number((dec ?? "").replace(/,/, "."));
}

function generateStatsHtml(macros) {
  const flexCenter = "display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;";

  const statsElement = document.createElement("div");
  statsElement.style = "display: grid; grid-auto-flow: column; gap: 16px; justify-content: center; align-items: center; width: 100%;";

  statsElement.innerHTML = `
<div style="${flexCenter} width: 100px; height: 100px; ${createCircleCss(macros.carbs.pct, "#f1cdb0")}">
  <div style="${flexCenter} width: 92px; height: 92px; background-color: white; border-radius: 50%;">
    <span style="font-size: 10px;">Carbs</span>
    <span style="font-size: 14px;">${macros.carbs.pct}%</span>
    <span style="font-size: 10px;">${macros.carbs.kcal} kcal</span>
  </div>
</div>
<div style="${flexCenter} width: 100px; height: 100px; ${createCircleCss(macros.proteins.pct, "#97f2f3")}">
  <div style="${flexCenter} width: 92px; height: 92px; background-color: white; border-radius: 50%;">
    <span style="font-size: 10px;">Proteins</span>
    <span style="font-size: 14px;">${macros.proteins.pct}%</span>
    <span style="font-size: 10px;">${macros.proteins.kcal} kcal</span>
  </div>
</div>
<div style="${flexCenter} width: 100px; height: 100px; ${createCircleCss(macros.fats.pct, "#89aeb2")}">
  <div style="${flexCenter} width: 92px; height: 92px; background-color: white; border-radius: 50%;">
    <span style="font-size: 10px;">Fats</span>
    <span style="font-size: 14px;">${macros.fats.pct}%</span>
    <span style="font-size: 10px;">${macros.fats.kcal} kcal</span>
  </div>
</div>
`;

  return statsElement;

  function createCircleCss(pct, color) {
    return `border-radius: 50%; background: conic-gradient(${color}ff ${Math.round((pct / 100) * 360)}deg, ${color}30 0deg);`;
  }
}
