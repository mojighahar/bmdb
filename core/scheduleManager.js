const StorageManager = require('./storageManager')
const Schedule = require('./components/schedule')

var schedules = []

class ScheduleManager {

  static load() {
    var scheduleList = StorageManager.read('schedules')
    scheduleList.forEach(schedule => {
      schedules.push(Schedule.fromObject(schedule))
    })
  }
  
  static start(name) {
    schedules.forEach(schedule => {
      if (name && schedule.name != name)
        return
      schedule.start(this)
    })
  }

  static run(name) {
    schedules.forEach(schedule => {
      if (name && schedule.name != name)
        return
      schedule.run(this)
    })
  }

  static All() {
    return schedules
  }

  static save() {
    var scheduleList = []
    schedules.forEach(schedule => {
      scheduleList.push(schedule.toObject())
    })
    StorageManager.write('schedules', scheduleList)
  }
}

ScheduleManager.load()

module.exports = ScheduleManager