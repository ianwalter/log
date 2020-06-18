const { test } = require('@ianwalter/bff')
const mockStdio = require('mock-stdio')
const signale = require('signale')
const log = require('..')

test('logger', t => {
  mockStdio.start()
  log.info('YO!')
  t.expect(mockStdio.end()).toMatchSnapshot()
})

test('log level', t => {
  mockStdio.start()
  log.update({ level: 'warn' })
  log.warn('I am the warrior!')
  log.info('Moonbeam')
  t.expect(mockStdio.end()).toMatchSnapshot()
})

test('works with signale', t => {
  mockStdio.start()
  log.update({ types: Object.keys(signale._types), logger: signale })
  log.success('Whoop! Whoop!')
  const { stdout } = mockStdio.end()
  t.expect(stdout).toContain('✔')
  t.expect(stdout).toContain('Whoop! Whoop!')
})

test('creating a new log instance', t => {
  const warnLog = log.create({ level: 'warn' })
  t.expect(log.options.level).toBe('info')
  t.expect(warnLog.options.level).toBe('warn')
})

test('returns what logger returns', t => {
  const returnLog = log.create({
    logger: {
      info (msg) {
        return msg
      }
    }
  })
  const msg = 'Elizabeth Warren for President'
  t.expect(returnLog.info(msg)).toBe(msg)
})

test('allowedNamespace', t => {
  const general = log.create({
    allowedNamespace: 'server.*',
    logger: {
      debug (msg) {
        return msg
      }
    }
  })
  t.expect(general.debug('TEST1')).toBeUndefined()
  t.expect(general.ns('server.workers').debug('TEST2')).toBe('TEST2')
  t.expect(general.debug('TEST3')).toBeUndefined()
  general.update({ namespace: 'server.middleware' })
  t.expect(general.debug('TEST4')).toBe('TEST4')
})
