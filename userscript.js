// ==UserScript==
// @name         Nemlig Extended Nutrient Info
// @namespace    https://www.nemlig.com/
// @version      2.2.0
// @description  Add extra nutrition info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @match        https://www.nemlig.com/*
// @icon         https://www.google.com/s2/favicons?domain=nemlig.com
// @grant        none
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

  // src/constant/advisoryConstants.ts
  var AdvisoryLevel;
  (function(AdvisoryLevel2) {
    AdvisoryLevel2["VERY_BAD"] = "VERY_BAD";
    AdvisoryLevel2["BAD"] = "BAD";
    AdvisoryLevel2["NEUTRAL"] = "NEUTRAL";
    AdvisoryLevel2["GOOD"] = "GOOD";
    AdvisoryLevel2["VERY_GOOD"] = "VERY_GOOD";
  })(AdvisoryLevel || (AdvisoryLevel = {}));
  var AdvisoryLevelIcon = Object.freeze({
    [AdvisoryLevel.VERY_BAD]: "\u{1F631}",
    [AdvisoryLevel.BAD]: "\u{1F630}",
    [AdvisoryLevel.NEUTRAL]: "\u{1F642}",
    [AdvisoryLevel.GOOD]: "\u{1F60B}",
    [AdvisoryLevel.VERY_GOOD]: "\u{1F60D}"
  });

  // src/constant/nutritionConstants.ts
  var Macronutrient;
  (function(Macronutrient2) {
    Macronutrient2["CARBOHYDRATE"] = "CARBOHYDRATE";
    Macronutrient2["FAT"] = "FAT";
    Macronutrient2["PROTEIN"] = "PROTEIN";
  })(Macronutrient || (Macronutrient = {}));
  var MacronutrientEnergyDensity = Object.freeze({
    [Macronutrient.FAT]: 9,
    [Macronutrient.CARBOHYDRATE]: 4,
    [Macronutrient.PROTEIN]: 4
  });

  // src/util/advisoryUtils.ts
  var DailyIntakeEnergy = 2500;
  var genAdvisorySaturatedFat = (itemEnergy, itemSaturatedFat) => {
    const energyPart = itemEnergy / DailyIntakeEnergy;
    const threshold = (pct) => DailyIntakeEnergy / 9 * pct;
    if (itemSaturatedFat > energyPart * threshold(0.15)) {
      return { level: AdvisoryLevel.VERY_BAD, message: "Very high in saturated fat" };
    } else if (itemSaturatedFat > energyPart * threshold(0.1)) {
      return { level: AdvisoryLevel.BAD, message: "High in saturated fat" };
    }
  };
  var genAdvisorySugar = (itemEnergy, itemSugar) => {
    const energyPart = itemEnergy / DailyIntakeEnergy;
    const threshold = (pct) => DailyIntakeEnergy / 4 * pct;
    if (itemSugar > energyPart * threshold(0.15)) {
      return { level: AdvisoryLevel.VERY_BAD, message: "Very high in sugar" };
    } else if (itemSugar > energyPart * threshold(0.1)) {
      return { level: AdvisoryLevel.BAD, message: "High in sugar" };
    }
  };
  var genAdvisoryFiber = (itemEnergy, itemFiber) => {
    const energyPart = itemEnergy / DailyIntakeEnergy;
    const threshold = (pct) => DailyIntakeEnergy / 250 * 3 * pct;
    if (itemFiber > energyPart * threshold(1.25)) {
      return { level: AdvisoryLevel.VERY_GOOD, message: "Very high in fiber" };
    } else if (itemFiber > energyPart * threshold(1)) {
      return { level: AdvisoryLevel.GOOD, message: "High in fiber" };
    }
  };
  var genAdvisorySalt = (itemEnergy, itemSalt) => {
    const energyPart = itemEnergy / DailyIntakeEnergy;
    const threshold = (grams) => energyPart * grams;
    if (itemSalt > threshold(8)) {
      return { level: AdvisoryLevel.VERY_BAD, message: "Very high in salt" };
    } else if (itemSalt > threshold(6)) {
      return { level: AdvisoryLevel.BAD, message: "High in salt" };
    }
  };
  var genAdvisories = (nutritionDeclaration) => {
    var _a, _b, _c, _d;
    const energy = (_a = nutritionDeclaration.energy) == null ? void 0 : _a.kcal;
    if (energy == null)
      return [];
    return [
      ((_b = nutritionDeclaration.fat) == null ? void 0 : _b.saturated) != null ? genAdvisorySaturatedFat(energy, nutritionDeclaration.fat.saturated) : null,
      ((_c = nutritionDeclaration.carbohydrate) == null ? void 0 : _c.sugar) != null ? genAdvisorySugar(energy, nutritionDeclaration.carbohydrate.sugar) : null,
      ((_d = nutritionDeclaration.carbohydrate) == null ? void 0 : _d.fiber) != null ? genAdvisoryFiber(energy, nutritionDeclaration.carbohydrate.fiber) : null,
      nutritionDeclaration.salt != null ? genAdvisorySalt(energy, nutritionDeclaration.salt) : null
    ].filter((e) => e != null);
  };

  // src/util/parseUtils.ts
  var parseNutrientDeclarations = () => {
    const nutritionDeclarationTableElement = document.querySelector("product-detail-declaration table.table");
    if (nutritionDeclarationTableElement == null)
      return null;
    const rawDeclarationsArr = Array.from(nutritionDeclarationTableElement.querySelectorAll("tr.table__row")).map((e) => Array.from(e.querySelectorAll("td.table__col")).map((e2) => e2.innerText.trim().toLowerCase())).filter((e) => e.length === 2).map(([k, v]) => [k.replace(/\s+/gi, "_"), v]);
    const decs = Object.fromEntries(rawDeclarationsArr);
    let energyValues = decs.energi.split("/").map((v) => processValue(v)).sort((a, b) => a - b);
    return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, processResEntry("energy", __spreadValues(__spreadValues({}, processResEntry("kcal", energyValues[0])), processResEntry("kj", energyValues[1])))), processResEntry("fat", __spreadValues(__spreadValues({}, processResEntry("total", decs.fedt)), processResEntry("saturated", decs.heraf_m\u00E6ttede_fedtsyrer)))), processResEntry("carbohydrate", __spreadValues(__spreadValues(__spreadValues({}, processResEntry("total", decs.kulhydrat)), processResEntry("dietaryFiber", decs.kostfibre)), processResEntry("sugar", decs.heraf_sukkerarter)))), processResEntry("protein", decs.protein)), processResEntry("salt", decs.salt));
    function processResEntry(name, value) {
      if (typeof value === "string" || typeof value === "number" || value == null) {
        return value != null ? { [name]: processValue(value) } : null;
      } else {
        return Object.keys(value).length > 0 ? { [name]: value } : null;
      }
    }
    function processValue(v) {
      return v != null ? Number(String(v).replace(/[^0-9,.]/gi, "").replace(/,/gi, ".")) : void 0;
    }
  };

  // src/render/advisoryRenders.ts
  function renderAdvisory() {
    let nutritionDeclarations = parseNutrientDeclarations();
    if (nutritionDeclarations == null)
      return null;
    let advisories = genAdvisories(nutritionDeclarations);
    const listHtml = advisories.map(({ level, message }) => `<span>${AdvisoryLevelIcon[level]} ${message}</span>`).join("");
    return listHtml !== "" ? `<div id="ExtNutriInfoAsvisorContainer" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 8px;"> ${listHtml} </div>` : null;
  }

  // src/render/macronutritionRenders.ts
  function renderMacronutrients() {
    var _a, _b, _c;
    let nutritionDeclarations = parseNutrientDeclarations();
    if (nutritionDeclarations == null)
      return null;
    let itemEnergy = (_a = nutritionDeclarations.energy) == null ? void 0 : _a.kcal;
    let itemCarbohydrate = (_b = nutritionDeclarations.carbohydrate) == null ? void 0 : _b.total;
    let itemFat = (_c = nutritionDeclarations.fat) == null ? void 0 : _c.total;
    let itemProtein = nutritionDeclarations == null ? void 0 : nutritionDeclarations.protein;
    if (itemEnergy == null || itemCarbohydrate == null || itemFat == null || itemProtein == null)
      return null;
    const totalMacronutrientEnergy = itemCarbohydrate * MacronutrientEnergyDensity.CARBOHYDRATE + itemProtein * MacronutrientEnergyDensity.PROTEIN + itemFat * MacronutrientEnergyDensity.FAT;
    let macros = {
      carbohydrate: calculateMacro(Macronutrient.CARBOHYDRATE, itemCarbohydrate),
      fat: calculateMacro(Macronutrient.FAT, itemFat),
      protein: calculateMacro(Macronutrient.PROTEIN, itemProtein)
    };
    const totalPct = macros.carbohydrate.pct + macros.protein.pct + macros.fat.pct;
    if (totalPct !== 100) {
      macros.fat.pct -= totalPct - 100;
    }
    return `
<div class="macros" style="display: grid; grid-auto-flow: column; gap: 16px; justify-content: center; align-items: center; width: 100%;">
  ${generateMacroStatHTML("Carb", macros.carbohydrate, "#E3D3A3") + generateMacroStatHTML("Protein", macros.protein, "#926C96") + generateMacroStatHTML("Fat", macros.fat, "#74968E")}
</div>
`;
    function calculateMacro(macro, macroAmount) {
      return {
        energy: Math.round(macroAmount * MacronutrientEnergyDensity[macro]),
        pct: Math.round(macroAmount * MacronutrientEnergyDensity[macro] / totalMacronutrientEnergy * 100)
      };
    }
    function generateMacroStatHTML(name, macro, color) {
      const flexCenter = "display: flex; flex-flow: column nowrap; justify-content: center; align-items: center;";
      const size = 80;
      const doughnutWidth = 2;
      const conicGradient = `background: conic-gradient(${color}ff ${Math.round(macro.pct / 100 * 360)}deg, ${color}20 0deg);`;
      return `
<div style="${flexCenter} width: ${size}px; height: ${size}px; border-radius: 50%; ${conicGradient}">
  <div style="${flexCenter} width: ${size - doughnutWidth * 2}px; height: ${size - doughnutWidth * 2}px; background-color: white; border-radius: 50%;">
    <span style="font-size: 12px;">${name}</span>
    <span style="font-size: 16px; font-weight: 600;">${macro.pct}%</span>
    <span style="font-size: 12px; color: #aaa;">${macro.energy} kcal</span>
  </div>
</div>
`;
    }
  }

  // src/render/separatorRender.ts
  var renderSeparatorStyles = ["margin: 16px auto 20px", "border: none", "border-top: 1px solid lightgrey", "width: 80%"].join("; ");
  function renderSeparator() {
    return `<hr style="${renderSeparatorStyles};" />`;
  }

  // src/index.ts
  setInterval(() => {
    render();
  }, 250);
  function shouldRender() {
    return document.querySelector("product-detail") != null && (document.querySelector("product-detail-declaration table.table tr.table__row") != null || document.querySelector("product-detail-declaration div.product-detail__declaration-label") != null) && document.querySelector("#ExtNutriInfoContainer") == null;
  }
  function render() {
    if (!shouldRender())
      return null;
    const containerElement = document.createElement("div");
    containerElement.id = "ExtNutriInfoContainer";
    containerElement.setAttribute("style", [
      "position: fixed",
      `z-index: 10`,
      "bottom: 0",
      "left: 8px",
      "border-radius: 4px 4px 0 0",
      "padding: 16px 20px 24px",
      "width: 296px",
      "background-color: white",
      "box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px"
    ].join("; "));
    containerElement.innerHTML = [renderAdvisory(), renderMacronutrients()].filter(Boolean).join(renderSeparator());
    document.querySelector("product-detail").append(containerElement);
  }
})();
