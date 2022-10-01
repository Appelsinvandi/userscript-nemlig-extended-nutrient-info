import path from 'path'

import { monorepoRootPath, workspaceRootPath } from './paths'

export function generateUserscriptHead(input?: {
  downloadURL?: string
  homepage?: string
  supportURL?: string
  updateURL?: string
}): string {
  const workspacePkg = require(path.resolve(workspaceRootPath, 'package.json'))
  const monorepoPkg = require(path.resolve(monorepoRootPath, 'package.json'))

  const meta = {
    ...input,
    author: workspacePkg.author ?? monorepoPkg.author,
    description: workspacePkg.description,
    grant: workspacePkg.userscriptMetadata.grant,
    icon: workspacePkg.userscriptMetadata.icon,
    match: workspacePkg.userscriptMetadata.match,
    name: workspacePkg.displayName ?? workspacePkg.name,
    namespace: workspacePkg.userscriptMetadata.namespace,
    version: workspacePkg.version,
  }

  return ([] as string[])
    .concat('// ==UserScript==')
    .concat(
      Object.entries(meta)
        .filter(([, v]) => v != null)
        .flatMap(([k, v]) =>
          Array.isArray(v) ? v.map((v) => `// @${k} ${v}`) : `// @${k} ${v}`
        )
        .sort((a, b) => a.localeCompare(b))
    )
    .concat(['// ==/UserScript==', '', ''])
    .join('\n')
}
