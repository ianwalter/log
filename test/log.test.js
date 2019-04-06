import test, { beforeEach } from 'ava'
import mockStdio from 'mock-stdio'
import signale from 'signale'
import { log, Log } from '..'

beforeEach(() => log.update())

test('logger', t => {
  mockStdio.start()
  log.info('YO!')
  t.snapshot(mockStdio.end())
})

test('log level', t => {
  mockStdio.start()
  log.update({ level: 'warn' })
  log.warn('I am the warrior!')
  log.info('Moonbeam')
  t.snapshot(mockStdio.end())
})

test('works with signale', t => {
  mockStdio.start()
  log.update({ types: Object.keys(signale._types), logger: signale })
  log.success('Whoop! Whoop!')
  const { stdout } = mockStdio.end()
  t.true(stdout.includes('✔'))
  t.true(stdout.includes('Whoop! Whoop!'))
})

test('creating a new log instance', t => {
  const warnLog = log.create({ level: 'warn' })
  t.is(log.options.level, 'info')
  t.is(warnLog.options.level, 'warn')
})

test('Log is the Log class', t => {
  t.is(Log.name, 'Log')
  const logInstance = new Log()
  t.is(logInstance.constructor.name, 'Log')
})
