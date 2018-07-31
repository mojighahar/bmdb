require('dotenv').config()
const path = require('path')
const StorageManager = require('./storageManager')
const LocalBackup = require('./components/localBackup')

var localBackups = []

class BackupManager {
  static async take(database) {
    var backup = LocalBackup.new(this.getLastId() + 1, database.id)
    await database.driver.backup(backup.path)
    localBackups.push(backup)
    this.save()
  }

  static getPath(database) {
    return path
  }

  static get() {

  }

  static apply() {

  }

  static load() {
    var backupList = StorageManager.read('localBackups')
    backupList.forEach(backup => {
      localBackups.push(LocalBackup.fromObject(backup))
    })
  }

  static find(id) {
    for (var i = 0, backup; backup = localBackups[i]; i++) {
      if (backup.id == id)
        return backup
    }
  }

  static save() {
    var backupList = []
    localBackups.forEach(backup => {
      backupList.push(backup.toObject())
    })
    StorageManager.write('localBackups', backupList)
  }

  static getLastId() {
    var lastId = 0;
    localBackups.forEach(backup => {
      if (backup.id > lastId)
        lastId = backup.id
    })
    return lastId
  }

  static getFirstId() {
    var firstId = null;
    localBackups.forEach(backup => {
      if (firstId == null || backup.id < firstId)
        firstId = backup.id
    })
    return firstId
  }

  static getUpdates(startId = 1, length = -1) {
    var updates = []
    for (var i = 0, backup; backup = localBackups[i]; i++) {
      if (backup.id >= startId)
        updates.push(backup.toObject())
      if (length != -1 && updates.length >= length)
        break
    }
    return updates
  }

  static remove(id) {
    for (var i = 0, backup; backup = localBackups[i]; i++) {
      if (backup.id == id) {
        backup.destroy()
        localBackups.splice(i, 1)
      }
    }
    this.save()
  }
}

BackupManager.load()

module.exports = BackupManager