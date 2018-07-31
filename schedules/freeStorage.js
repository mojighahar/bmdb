const gfs = require('get-folder-size')
const path = require('path')
const BackupManager = require('../core/backupManager')
const RemoteManager = require('../core/remoteManager')

function checkUsage(dir, max) {
  return new Promise((resolve, reject) => {
    gfs(dir, (error, size) => {
      if(error) {
        reject(error)
        return
      }
      console.log(size)
      resolve(size >= max)
    })
  })
}

function removeOldestRemote() {
  RemoteManager.remove(RemoteManager.getFirstId())
}

function removeOldestLocal() {
  BackupManager.remove(BackupManager.getFirstId())
}

module.exports = async function (data) {
  while(await checkUsage(path.resolve(__dirname, '../backups/local'), data.maxLocalSize)) {
    removeOldestLocal()
  }
  while(await checkUsage(path.resolve(__dirname, '../backups/remote'), data.maxRemoteSize)) {
    removeOldestRemote()
  }
}

