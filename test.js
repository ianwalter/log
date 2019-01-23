import test from 'ava'
import log from '.'

test('logger', t => {
  let loggedMsg
  let msg = 'YO!'

  log.setOptions({ logger: item => (loggedMsg = item) })
  log.info(msg)

  t.is(loggedMsg, msg)
})

test('log level', t => {
  let loggedMsg
  let msg = 'I am the warrior!'

  log.setOptions({ logger: item => (loggedMsg = item), level: 'warn' })
  log.warn(msg)
  log.info('Moonbeam')

  t.is(loggedMsg, msg)
})

