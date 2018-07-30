const StorageManager = require('./storageManager')
const Remote = require('./components/remote')
const LocalBackup = require('./components/localBackup')
const RemoteBackup = require('./components/remoteBackup')

var remotes = []
var remoteBackups = []

class RemoteManager {
  static async pull(id) {
    console.log('Pulling remote id: ' + id)
    var remote = this.find(id)
    console.log('Remote Finded: ' + remote.toObject());
    
    var updates = await remote.getUpdates(this.getLastRemoteId(id))
    console.log(update.length + ' Updates detected')
    for (var i = 0, update; update = updates[i]; i++) {
      var backup = RemoteBackup.new(
          this.getLastId(),
          id,
          new LocalBackup(
            update.id,
            update.databaseId,
            update.date,
            update.path,
            update.valid
          )
        )
      console.log('Downloading backup id: ' + update.id)
      await remote.download(backup.remote.id, backup.path)
      console.log('Downloaded backup id: ' + update.id)
      remoteBackups.push(backup)
      this.saveBackups()
    }
  }

  static getLastId() {
    var lastId = 0;
    remoteBackups.forEach(backup => {
      if (backup.id > lastId)
        lastId = backup.id
    })
    return lastId + 1
  }

  static getLastRemoteId(id) {
    var lastId = 0;
    remoteBackups.forEach(backup => {
      if (backup.remoteId == id && backup.remote.id > lastId)
        lastId = backup.remote.id
    })
    return lastId + 1
  }

  static find(id) {
    for (var i = 0, remote; remote = remotes[i]; i++) {
      if (remote.id == id)
        return remote
    }
  }

  static search(id = null, remoteId = null, databaseId = null) {
    var results = []
    for (var i = 0, backup; backup = remoteBackups[i]; i++) {
      if (id == null || backup.id == id) {
        if (remoteId == null || backup.remoteId == remoteId) {
          if (databaseId == null || backup.remote.databaseId == databaseId) {
            results.push(backup)
          }
        }
      }
    }
    return results
  }

  static findBackup(id) {
    for (var i = 0, backup; backup = remoteBackups[i]; i++) {
      if (backup.id == id)
        return backup
    }
  }

  static load() {
    this.loadBackups()
    this.loadRemotes()
  }

  static loadBackups() {
    var backupList = StorageManager.read('remoteBackups')
    backupList.forEach(backup => {
      remoteBackups.push(RemoteBackup.fromObject(backup))
    })
  }

  static loadRemotes() {
    var remoteList = StorageManager.read('remotes')
    remoteList.forEach(remote => {
      remotes.push(Remote.fromObject(remote))
    })
  }

  static save() {
    this.saveBackups()
    this.saveRemotes()
  }

  static saveBackups() {
    var backupList = []
    remoteBackups.forEach(backup => {
      backupList.push(backup.toObject())
    })
    StorageManager.write('remoteBackups', backupList)
  }

  static saveRemotes() {
    var remoteList = []
    remotes.forEach(remote => {
      remoteList.push(remote.toObject(remote))
    })
    StorageManager.write('remotes', remoteList)
  }
}

RemoteManager.load()

module.exports = RemoteManager