import merge from '@ianwalter/merge'
import { match } from '@ianwalter/dot'

// Create the default log levels and options.
const levels = [
  'debug', // For debugging code through log statements.
  'info', // For general logging statements.
  'warn', // For warning about issues that are not necessarily errors.
  'error', // For normal errors.
  'fatal', // For unrecoverable errors.
  'write' // For writing statements not bound by a log level.
]
const defaultOptions = {
  levels,
  types: levels,
  level: 'info'
}

function addTypes (log) {
  // Loop through all of the log types, adding a function to the log instance
  // based on the type name, e.g. log.debug, log.info, etc.
  log.options.types.forEach(type => {
    const descriptor = {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function (...items) {
        // Check if the type is a log level. If it is, determine if the items
        // can be logged based on it's position relative to the current log
        // level or whether the namespace on the logger instance is allowed.
        const namespaceIsAllowed = this.options.unrestricted && match(
          this.options.unrestricted,
          this.options.namespace
        )
        const typeIndex = this.options.levels.indexOf(type)
        const levelIndex = this.options.levels.indexOf(this.options.level)
        if (typeIndex >= levelIndex || namespaceIsAllowed || typeIndex === -1) {
          return this.options.logger[type](...items)
        }
      }
    }
    if (!log[type]) Object.defineProperty(log, type, descriptor)
  })
}

function createLog (options = {}) {
  // Don't try to merge the logger, but use console if one isn't specified.
  const { logger = console, ...rest } = options
  options = merge({}, defaultOptions, rest)
  options.logger = logger

  const log = {
    options,
    create (options = {}) {
      return createLog(options)
    },
    update (options) {
      // Clean up obsolete log types.
      this.options.types.forEach(type => {
        if (options.types && options.types.indexOf(type) === -1) {
          delete this[type]
        }
      })

      // Merge the passed options with the existing options.
      merge(this.options, options)

      // Add the types to the log instance now that the options are updated.
      addTypes(this)

      // Return the log instance.
      return this
    },
    ns (namespace) {
      return this.create(merge({}, this.options, { namespace }))
    }
  }

  addTypes(log)

  return log
}

// Export a global log instance.
export default createLog()
