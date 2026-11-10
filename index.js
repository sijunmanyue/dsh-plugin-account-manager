/**
 * dsh-account-manager — Host half.
 *
 * Exposes a small local JSON API for the account-manager page:
 *   GET  /api/dsh-account-manager/accounts
 *   POST /api/dsh-account-manager/accounts          { system, systemType, environment, username, password, purpose }
 *   POST /api/dsh-account-manager/accounts/delete   { id }
 *
 * All accounts live in one JSON file. `filePath` can be set in the bundle
 * config; relative values resolve against DSH_HOME, and `~` expands to the
 * user's home directory. The default is:
 *   <DSH_HOME>/account-manager/accounts.json
 *
 * Passwords are deliberately stored in plain text, as requested. The route is
 * loopback-only and never adds CORS headers, but the file itself is only as
 * private as the filesystem permissions around it.
 */

import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'

const ROUTE = '/api/dsh-account-manager'
const VERSION = '1.0.0'
const STORE_VERSION = 1
const MAX_BODY_BYTES = 256 * 1024

const LIMITS = {
  system: 80,
  environment: 60,
  username: 200,
  password: 512,
  purpose: 1000,
}

function dshHome() {
  return process.env.DSH_HOME || join(homedir(), '.dsh')
}

function expandHome(value) {
  if (value === '~') return homedir()
  if (value.startsWith('~/') || value.startsWith('~\\')) return join(homedir(), value.slice(2))
  return value
}

function resolveStorePath(config) {
  const configured = config && typeof config.filePath === 'string' ? config.filePath.trim() : ''
  if (!configured) return join(dshHome(), 'account-manager', 'accounts.json')
  const expanded = expandHome(configured)
  return isAbsolute(expanded) ? expanded : resolve(dshHome(), expanded)
}

function emptyStore() {
  return { version: STORE_VERSION, accounts: [] }
}

function httpError(status, code, message) {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

function text(value, field, max, { trim = true, allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    throw httpError(400, 'VALIDATION', `${field} must be a string`)
  }
  const normalized = trim ? value.trim() : value
  if (!allowEmpty && normalized.length === 0) {
    throw httpError(400, 'VALIDATION', `${field} is required`)
  }
  if (normalized.length > max) {
    throw httpError(400, 'VALIDATION', `${field} is too long`)
  }
  return normalized
}

function normalizeStoredAccount(raw, index) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`account ${index + 1} is not an object`)
  }
  const systemType = raw.systemType === 'company' || raw.systemType === 'personal' ? raw.systemType : ''
  if (!systemType) throw new Error(`account ${index + 1} has an invalid systemType`)
  const id = typeof raw.id === 'string' && raw.id ? raw.id : ''
  const system = text(raw.system, `account ${index + 1} system`, LIMITS.system)
  const username = text(raw.username, `account ${index + 1} username`, LIMITS.username)
  const password = text(raw.password, `account ${index + 1} password`, LIMITS.password, { trim: false })
  const purpose = text(raw.purpose, `account ${index + 1} purpose`, LIMITS.purpose)
  const environment = systemType === 'company'
    ? text(raw.environment, `account ${index + 1} environment`, LIMITS.environment)
    : ''
  return { id, system, systemType, environment, username, password, purpose }
}

function readStore(filePath) {
  if (!existsSync(filePath)) return emptyStore()
  let raw
  try {
    raw = readFileSync(filePath, 'utf8')
  } catch (error) {
    throw httpError(500, 'IO_ERROR', `cannot read ${filePath}: ${String(error && error.message || error)}`)
  }
  if (!raw.trim()) return emptyStore()

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    throw httpError(500, 'STORE_CORRUPT', `${filePath} is not valid JSON`)
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw httpError(500, 'STORE_CORRUPT', `${filePath} must contain a JSON object`)
  }
  if (parsed.version !== undefined && parsed.version !== STORE_VERSION) {
    throw httpError(500, 'STORE_CORRUPT', `${filePath} has unsupported version ${String(parsed.version)}`)
  }
  if (!Array.isArray(parsed.accounts)) {
    throw httpError(500, 'STORE_CORRUPT', `${filePath} must contain an accounts array`)
  }
  try {
    return { version: STORE_VERSION, accounts: parsed.accounts.map(normalizeStoredAccount) }
  } catch (error) {
    throw httpError(500, 'STORE_CORRUPT', `${filePath}: ${String(error && error.message || error)}`)
  }
}

function writeStore(filePath, store) {
  const directory = dirname(filePath)
  try {
    mkdirSync(directory, { recursive: true })
  } catch (error) {
    throw httpError(500, 'IO_ERROR', `cannot create ${directory}: ${String(error && error.message || error)}`)
  }

  const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`
  const content = `${JSON.stringify({ version: STORE_VERSION, accounts: store.accounts }, null, 2)}\n`
  try {
    writeFileSync(temp, content, { encoding: 'utf8', mode: 0o600 })
    renameSync(temp, filePath)
  } catch (error) {
    try {
      if (existsSync(temp)) unlinkSync(temp)
    } catch {
      /* best-effort temp cleanup */
    }
    throw httpError(500, 'IO_ERROR', `cannot write ${filePath}: ${String(error && error.message || error)}`)
  }
}

function parseAccountInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw httpError(400, 'VALIDATION', 'request body must be a JSON object')
  }
  const systemType = body.systemType === 'company' || body.systemType === 'personal' ? body.systemType : ''
  if (!systemType) throw httpError(400, 'VALIDATION', 'systemType must be company or personal')
  return {
    system: text(body.system, 'system', LIMITS.system),
    systemType,
    environment: systemType === 'company'
      ? text(body.environment, 'environment', LIMITS.environment)
      : '',
    username: text(body.username, 'username', LIMITS.username),
    password: text(body.password, 'password', LIMITS.password, { trim: false }),
    purpose: text(body.purpose, 'purpose', LIMITS.purpose),
  }
}

function isLoopback(req) {
  const address = req.socket && req.socket.remoteAddress
  if (!address) return false
  return address === '127.0.0.1'
    || address === '::1'
    || address === '::ffff:127.0.0.1'
}

function sendJson(res, status, payload) {
  if (res.writableEnded) return
  const textBody = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.setHeader('cache-control', 'no-store')
  res.setHeader('x-content-type-options', 'nosniff')
  res.setHeader('content-length', Buffer.byteLength(textBody))
  res.end(textBody)
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        rejectBody(httpError(413, 'BODY_TOO_LARGE', 'request body is too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', rejectBody)
  })
}

async function readJson(req) {
  const raw = await readBody(req)
  if (!raw) throw httpError(400, 'INVALID_BODY', 'request body is empty')
  try {
    return JSON.parse(raw)
  } catch {
    throw httpError(400, 'INVALID_BODY', 'request body is not valid JSON')
  }
}

async function handle(req, res, filePath) {
  if (!isLoopback(req)) {
    sendJson(res, 403, { ok: false, code: 'FORBIDDEN', message: 'local requests only' })
    return
  }

  const url = new URL(String(req.url || '/'), 'http://localhost')
  let pathname = url.pathname
  if (pathname.startsWith(ROUTE)) pathname = pathname.slice(ROUTE.length)
  pathname = pathname.replace(/\/+$/, '') || '/'

  if (req.method === 'GET' && pathname === '/') {
    sendJson(res, 200, { ok: true, plugin: 'dsh-account-manager', version: VERSION, filePath })
    return
  }

  if (req.method === 'GET' && pathname === '/accounts') {
    const store = readStore(filePath)
    sendJson(res, 200, {
      ok: true,
      version: VERSION,
      filePath,
      count: store.accounts.length,
      accounts: store.accounts,
    })
    return
  }

  if (req.method === 'POST' && pathname === '/accounts') {
    const contentType = String(req.headers['content-type'] || '').toLowerCase()
    if (!contentType.startsWith('application/json')) {
      throw httpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'content-type must be application/json')
    }
    const input = parseAccountInput(await readJson(req))
    const store = readStore(filePath)
    const account = { id: randomUUID(), ...input }
    store.accounts.unshift(account)
    writeStore(filePath, store)
    sendJson(res, 201, { ok: true, account, count: store.accounts.length })
    return
  }

  if (req.method === 'POST' && pathname === '/accounts/delete') {
    const contentType = String(req.headers['content-type'] || '').toLowerCase()
    if (!contentType.startsWith('application/json')) {
      throw httpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'content-type must be application/json')
    }
    const body = await readJson(req)
    const id = typeof body?.id === 'string' ? body.id : ''
    if (!id) throw httpError(400, 'VALIDATION', 'id is required')
    const store = readStore(filePath)
    const index = store.accounts.findIndex((account) => account.id === id)
    if (index === -1) throw httpError(404, 'NOT_FOUND', 'account not found')
    store.accounts.splice(index, 1)
    writeStore(filePath, store)
    sendJson(res, 200, { ok: true, deleted: id, count: store.accounts.length })
    return
  }

  sendJson(res, 404, { ok: false, code: 'NOT_FOUND', message: 'route not found' })
}

export const inject = ['webServer']

export function apply(ctx, config) {
  const webServer = (ctx.get && ctx.get('webServer')) || ctx.webServer
  if (!webServer || typeof webServer.register !== 'function') {
    console.error('[dsh-account-manager] webServer service is unavailable; the page cannot load accounts')
    return
  }

  const filePath = resolveStorePath(config)
  ctx.effect(
    () => webServer.register({
      kind: 'prefix',
      path: ROUTE,
      handler: async (req, res) => {
        try {
          await handle(req, res, filePath)
        } catch (error) {
          const status = Number(error && error.status) || 500
          const code = (error && error.code) || 'INTERNAL_ERROR'
          const message = String((error && error.message) || error)
          sendJson(res, status, { ok: false, code, message })
        }
      },
    }),
    'dsh-account-manager: HTTP route',
  )

  console.log(`[dsh-account-manager] v${VERSION} ready at ${ROUTE}; store: ${filePath}`)
}
