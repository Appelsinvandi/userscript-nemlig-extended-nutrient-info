import { Command, Option, UsageError } from 'clipanion'
import fs from 'fs'
import path from 'path'

import { CliCtx } from '../types'
import {
  compileUserscriptHead,
  getUserscriptMetaFromProject,
  monorepoRootPath,
  workspaceRootPath,
} from '../utils'
import { buildScript } from '../utils/buildScript'

export class DefaultCommand extends Command<CliCtx> {
  inputFilePath = Option.String()
  outputFilePath = Option.String()

  devMode = Option.Boolean('--dev')

  repoUrlBase = Option.String('--repo-url-base', { env: 'REPO_URL_BASE' })
  downloadUrlBase = Option.String('--download-url-base', {
    env: 'DOWNLOAD_URL_BASE',
  })

  async execute(): Promise<void> {
    if (this.devMode) {
      await this.buildDev()
    } else {
      await this.buildProd()
    }
  }

  async buildDev() {
    const absInputFilePath = path.resolve(this.context.cwd, this.inputFilePath)
    const absOutputFilePath = path.resolve(
      this.context.cwd,
      this.outputFilePath
    )

    await buildScript(absInputFilePath, absOutputFilePath, {
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error('watch build failed:', error)
          } else {
            console.log('watch build succeeded:', result)
          }
        },
      },
    })

    const userscriptMeta = getUserscriptMetaFromProject()
    userscriptMeta.name += ' - Dev'
    fs.writeFileSync(
      path.resolve(
        path.dirname(absOutputFilePath),
        path.basename(absOutputFilePath, 'user.js') + 'dev.user.js'
      ),
      compileUserscriptHead({
        ...userscriptMeta,
        require: 'file://' + absOutputFilePath,
      })
    )
  }

  async buildProd() {
    const repoUrlBase = this.repoUrlBase?.replace(/\/+$/, '')
    const downloadUrlBase = this.downloadUrlBase?.replace(/\/+$/, '')
    const workspaceRelativePath = path.relative(
      monorepoRootPath,
      workspaceRootPath
    )

    const absInputFilePath = path.resolve(this.context.cwd, this.inputFilePath)
    const absOutputFilePath = path.resolve(
      this.context.cwd,
      this.outputFilePath
    )

    if (!fs.existsSync(this.inputFilePath)) {
      throw new UsageError('Input file path does not exist.')
    } else if (fs.statSync(this.inputFilePath).isDirectory()) {
      throw new UsageError('Input file path is a directory.')
    }

    const buildRes = await buildScript(absInputFilePath, absOutputFilePath)
    buildRes.stop?.()

    fs.writeFileSync(
      absOutputFilePath,
      compileUserscriptHead({
        ...getUserscriptMetaFromProject(),
        homepage: repoUrlBase
          ? repoUrlBase + '/' + workspaceRelativePath.replace(/\\/g, '/')
          : undefined,
        supportURL: repoUrlBase ? repoUrlBase + '/issues' : undefined,
        downloadURL: downloadUrlBase
          ? downloadUrlBase + '/' + path.basename(this.outputFilePath)
          : undefined,
        updateURL: downloadUrlBase
          ? downloadUrlBase + '/' + path.basename(this.outputFilePath)
          : undefined,
      }) + fs.readFileSync(absOutputFilePath)
    )
  }
}
