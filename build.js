const fs = require('fs')
const pkg = require('./package.json')

const outputFile = './userscript.js'

require('esbuild')
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: outputFile,
    bundle: true,
    target: 'es6',
    platform: 'browser',
  })
  .then((result) => {
    const buildOutput = fs.readFileSync(outputFile)
    fs.writeFileSync(outputFile, genUserScriptHead() + buildOutput, {})

    result.stop?.()
  })

function genUserScriptHead() {
  return `// ==UserScript==
// @name         Nemlig Extended Nutrient Info
// @namespace    https://www.nemlig.com/
// @version      ${pkg.version}
// @description  Add extra nutrition info to nemlig.com
// @author       Appensinvandi
// @updateURL    https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/Appelsinvandi/userscript-nemlig-macronutrients/main/userscript.js
// @match        https://www.nemlig.com/*
// @icon         https://www.google.com/s2/favicons?domain=nemlig.com
// @grant        none
// ==/UserScript==

`
}
