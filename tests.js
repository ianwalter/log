const { test } = require('@ianwalter/bff')
const signale = require('signale')
const mockStdio = require('mock-stdio')
const log = require('.')

const logger = {
  debug (...items) {
    return items.length > 1 ? items : items[0]
  },
  info (...items) {
    return items.length > 1 ? items : items[0]
  },
  warn (...items) {
    return items.length > 1 ? items : items[0]
  }
}
log.update({ logger })

test('log', t => t.expect(log.info('YO!')).toBe('YO!'))

test('log level', t => {
  const warnLog = log.create({ level: 'warn' })
  t.expect(warnLog.warn('I am the warrior!')).toBe('I am the warrior!')
  t.expect(warnLog.info('Moonbeam')).toBeUndefined()
})

test('works with signale', t => {
  mockStdio.start()
  const sigLog = log.create({
    types: Object.keys(signale._types),
    logger: signale
  })
  sigLog.success('Whoop! Whoop!')
  const { stdout } = mockStdio.end()
  t.expect(stdout).toContain('✔')
  t.expect(stdout).toContain('Whoop! Whoop!')
})

test('allowedNamespace', t => {
  const serverLog = log.create({ allowedNamespace: 'server.*', logger })
  t.expect(serverLog.debug('TEST1')).toBeUndefined()
  t.expect(serverLog.ns('server.workers').debug('TEST2')).toBe('TEST2')
  t.expect(serverLog.debug('TEST3')).toBeUndefined()
  serverLog.update({ namespace: 'server.middleware' })
  t.expect(serverLog.debug('TEST4')).toBe('TEST4')
})
