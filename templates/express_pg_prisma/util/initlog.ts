import { existsSync, mkdirSync } from 'fs'

export const initLog = () => {
  if (!existsSync('./logs')) {
    mkdirSync('./logs');
  }
}