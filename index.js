// Create the default log levels and options.
const levels = ['debug', 'info', 'warn', 'error', 'fatal']
const defaultOptions = {
  levels,
  types: levels,
  logger: console,
  level: 'info'
}

class Log {
  constructor (options = {}) {
    // Set the log options.
    this.options = Object.assign({}, defaultOptions, options)

    // Loop through all of the log types, adding a function to the log instance
    // based on the type name, e.g. log.debug, log.info, etc.
    this.options.types.forEach(type => {
      this[type] = (...items) => {
        // Check if the type is a log level. If it is, determine if the items
        // can be logged based on it's position relative to the current log
        // level. If it isn't, go ahead and log the items using the log type.
        const typeIndex = this.options.levels.indexOf(type)
        const levelIndex = this.options.levels.indexOf(this.options.level)
        if (typeIndex === -1 || typeIndex >= levelIndex) {
          this.options.logger[type](...items)
        }
      }
    })
  }

  create (options) {
    // Create and return a new Log instance with the given options.
    return new Log(options)
  }

  update (options) {
    // Clean up existing log types.
    this.options.types.forEach(type => delete this[type])

    // Replace the global log's properties with properties from a new Log based
    // on the given options.
    Object.assign(this, new Log(options))
  }
}

// Export a global log instance.
export default new Log()
