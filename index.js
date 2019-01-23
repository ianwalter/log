const levels = ['debug', 'info', 'warn', 'error', 'fatal']

class Log {
  constructor () {
    this.options = {
      logger: console.log,
      level: 'info'
    }

    levels.forEach(level => {
      this[level] = (...items) => {
        if (levels.indexOf(level) >= levels.indexOf(this.options.level)) {
          this.options.logger(...items)
        }
      }
    })
  }

  setOptions (options) {
    return Object.assign(this.options, options)
  }
}

export default new Log()
