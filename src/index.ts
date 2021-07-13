// ==UserScript==
// @name         Nemlig Extended Nutrient Info
// @namespace    https://www.nemlig.com/
// @version      2.2.0
// @description  Add extra nutrition info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @match        https://www.nemlig.com/*
// @grant        none
// ==/UserScript==

import { renderAdvisory, renderAllergy, renderMacronutrients, renderSeparator } from './render'

setInterval(() => {
  render()
}, 250)

function shouldRender() {
  return (
    document.querySelector('product-detail') != null &&
    (document.querySelector('product-detail-declaration table.table tr.table__row') != null ||
      document.querySelector('product-detail-declaration div.product-detail__declaration-label') != null) &&
    document.querySelector('#ExtNutriInfoContainer') == null
  )
}

function render() {
  if (!shouldRender()) return null

  const containerElement = document.createElement('div')
  containerElement.id = 'ExtNutriInfoContainer'
  containerElement.setAttribute(
    'style',
    [
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
  )

  containerElement.innerHTML = [renderAllergy(), renderAdvisory(), renderMacronutrients()].filter(Boolean).join(renderSeparator())

  document.querySelector('product-detail')!.append(containerElement)
}
