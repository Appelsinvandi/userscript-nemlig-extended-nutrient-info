import { Builtins, Cli } from 'clipanion'

import { DefaultCommand } from './commands'
import { CliCtx } from './types'

const cli = new Cli<CliCtx>({
  binaryLabel: 'UserScript Builder',
  binaryName: 'userscript-builder',
})

cli.register(Builtins.HelpCommand)

cli.register(DefaultCommand)

cli.run(process.argv.slice(2), {
  cwd: process.cwd(),
})
