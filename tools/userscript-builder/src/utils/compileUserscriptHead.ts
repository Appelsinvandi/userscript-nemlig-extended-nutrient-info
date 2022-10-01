export function compileUserscriptHead(
  metadata: Record<string, string | string[] | undefined>
) {
  return [
    '// ==UserScript==',
    ...Object.entries(metadata)
      .filter(([, v]) => v != null)
      .flatMap(([k, v]) =>
        Array.isArray(v) ? v.map((v) => `// @${k} ${v}`) : `// @${k} ${v}`
      )
      .sort((a, b) => a.localeCompare(b)),
    '// ==/UserScript==',
    '',
    '',
  ].join('\n')
}
