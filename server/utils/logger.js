// Colored terminal logger — makes server output easy to read
const c = {
  reset:  '\x1b[0m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
  white:  '\x1b[97m',
}

function ts() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

const logger = {
  info:    (...a) => console.log( `${c.cyan}[INFO]  ${c.gray}${ts()}${c.reset}`, ...a),
  success: (...a) => console.log( `${c.green}[OK]    ${c.gray}${ts()}${c.reset}`, ...a),
  warn:    (...a) => console.warn(`${c.yellow}[WARN]  ${c.gray}${ts()}${c.reset}`, ...a),
  error:   (...a) => console.error(`${c.red}[ERROR] ${c.gray}${ts()}${c.reset}`, ...a),
  req:     (method, path, ms) =>
    console.log(`${c.gray}[REQ]   ${ts()} ${c.white}${method.padEnd(6)}${c.reset} ${path} ${c.gray}${ms}ms${c.reset}`),
}

module.exports = logger