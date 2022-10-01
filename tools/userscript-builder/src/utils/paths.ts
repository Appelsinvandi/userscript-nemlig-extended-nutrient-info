import path from 'path'

export const workspaceRootPath = (() => {
  return path.resolve(process.cwd())
})()
export const monorepoRootPath = (() => {
  return path.resolve(workspaceRootPath, '..', '..')
})()
