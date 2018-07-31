const path = require('path')

class Schedule {
  constructor(name, type, duration, data = {}, enabled = true, lastRun) {
    this.name = name
    this.type = type
    this.duration = duration
    this.data = data
    this.enabled = enabled
    this.lastRun = lastRun
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  start(master) {
    if(this.enabled) {
      this.interval = setInterval(() => this.run(master), this.duration)
      this.run(master)
    }
  }

  stop() {
    if(this.interval)
      clearInterval(this.interval)
  }

  run(master) {
    this.lastRun = Date.now()
    master.save()
    var scheduleFile = path.resolve(__dirname, '../../schedules/', this.type)
    require(scheduleFile)(this.data)
  }

  static fromObject(object) {
    return new Schedule(object.name, object.type, object.duration, object.data, object.enabled, object.lastRun)
  }

  toObject() {
    return {
      name: this.name,
      type: this.type,
      duration: this.duration,
      data: this.data,
      enabled: this.enabled,
      lastRun: this.lastRun,
    }
  }
}

module.exports = Schedule