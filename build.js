const fs = require('fs')
const pkg = require('./package.json')

const outputFileName = 'userscript.js'
const outputFilePath = `./${outputFileName}`
const branch = 'main'

require('esbuild')
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: outputFilePath,
    bundle: true,
    target: 'es6',
    platform: 'browser',
  })
  .then((result) => {
    const buildOutput = fs.readFileSync(outputFilePath)
    fs.writeFileSync(outputFileName, genUserScriptHead() + buildOutput, {})

    result.stop?.()
  })

function genUserScriptHead() {
  const repo = 'Appelsinvandi/userscript-nemlig-extended-nutrient-info'
  const fileUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${outputFileName}`

  return `// ==UserScript==
// @name         Nemlig Extended Nutrient Info
// @namespace    https://www.nemlig.com/
// @version      ${pkg.version}
// @description  ${pkg.description}
// @homepage     https://github.com/${repo}
// @supportURL   https://github.com/${repo}/issues
// @author       ${pkg.author}
// @updateURL    ${fileUrl}
// @downloadURL  ${fileUrl}
// @match        https://www.nemlig.com/*
// @icon         https://www.google.com/s2/favicons?domain=nemlig.com
// @grant        none
// ==/UserScript==

`
}
