import { build } from 'esbuild'

export function buildScript(inputFilePath: string, outputFilePath: string) {
  return build({
    entryPoints: [inputFilePath],
    outfile: outputFilePath,
    bundle: true,
    target: 'es6',
    platform: 'browser',
  })
}
