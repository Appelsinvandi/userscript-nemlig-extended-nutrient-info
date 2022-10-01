import path from 'path'

import { monorepoRootPath, workspaceRootPath } from './paths'

export function getUserscriptMetaFromProject() {
  const workspacePkg = require(path.resolve(workspaceRootPath, 'package.json'))
  const monorepoPkg = require(path.resolve(monorepoRootPath, 'package.json'))

  return {
    author: (workspacePkg.author ?? monorepoPkg.author) as string | undefined,
    description: workspacePkg.description as string | undefined,
    grant: workspacePkg.userscriptMetadata.grant as string[] | undefined,
    icon: workspacePkg.userscriptMetadata.icon as string | undefined,
    match: workspacePkg.userscriptMetadata.match as string[] | undefined,
    name: (workspacePkg.displayName ?? workspacePkg.name) as string | undefined,
    namespace: workspacePkg.userscriptMetadata.namespace as string | undefined,
    version: workspacePkg.version as string | undefined,
  }
}
