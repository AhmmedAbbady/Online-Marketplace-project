import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// This project is a Vite + React app.
// We provide this file so the command `npm start app.js` works:
// - npm will pass the extra "app.js" argument to this script
// - we intentionally ignore extra args and just start the dev server

const isWindows = process.platform === 'win32'

const viteBin = isWindows
  ? join('node_modules', '.bin', 'vite.cmd')
  : join('node_modules', '.bin', 'vite')

const hasLocalVite = existsSync(viteBin)

// Always open the app in the default browser.
// Also accept any extra CLI args passed after `app.js`.
// Example: `npm start app.js -- --host`
const forwardedArgs = process.argv.slice(2).filter((arg) => arg !== 'app.js')
const viteArgs = ['--open', ...forwardedArgs]

const child = spawn(hasLocalVite ? viteBin : 'vite', viteArgs, {
  stdio: 'inherit',
  shell: isWindows,
})

child.on('exit', (code) => {
  process.exit(typeof code === 'number' ? code : 0)
})
