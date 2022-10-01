import { build, BuildOptions } from 'esbuild'

export function buildScript(
  inputFilePath: string,
  outputFilePath: string,
  overrides?: Partial<BuildOptions>
) {
  return build({
    entryPoints: [inputFilePath],
    outfile: outputFilePath,
    bundle: true,
    target: 'es6',
    platform: 'browser',
    ...overrides,
  })
}
