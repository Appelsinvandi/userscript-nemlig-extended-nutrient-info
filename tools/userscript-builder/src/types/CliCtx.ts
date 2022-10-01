import { BaseContext } from 'clipanion'

export type CliCtx = BaseContext & {
  cwd: string
}
