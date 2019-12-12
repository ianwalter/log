const { test } = require('@ianwalter/bff')
const mockStdio = require('mock-stdio')
const signale = require('signale')
const { log, Log } = require('..')

test('logger', ({ expect }) => {
  log.update()
  mockStdio.start()
  log.info('YO!')
  expect(mockStdio.end()).toMatchSnapshot()
})

test('log level', ({ expect }) => {
  log.update()
  mockStdio.start()
  log.update({ level: 'warn' })
  log.warn('I am the warrior!')
  log.info('Moonbeam')
  expect(mockStdio.end()).toMatchSnapshot()
})

test('works with signale', ({ expect }) => {
  log.update()
  mockStdio.start()
  log.update({ types: Object.keys(signale._types), logger: signale })
  log.success('Whoop! Whoop!')
  const { stdout } = mockStdio.end()
  expect(stdout).toContain('✔')
  expect(stdout).toContain('Whoop! Whoop!')
})

test('creating a new log instance', ({ expect }) => {
  log.update()
  const warnLog = log.create({ level: 'warn' })
  expect(log.options.level).toBe('info')
  expect(warnLog.options.level).toBe('warn')
})

test('Log is the Log class', ({ expect }) => {
  log.update()
  expect(Log.name).toBe('Log')
  const logInstance = new Log()
  expect(logInstance.constructor.name).toBe('Log')
})

test('returns what logger returns', ({ expect }) => {
  const log = new Log({
    logger: {
      info (msg) {
        return msg
      }
    }
  })
  const msg = 'Elizabeth Warren for President'
  expect(log.info(msg)).toBe(msg)
})
