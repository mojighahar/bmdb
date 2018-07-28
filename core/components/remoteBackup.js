const Path = require('path')

class RemoteBackup {
  constructor(id, remoteId, date, path, valid = true, remote) {
    this.id = id
    this.remoteId = remoteId
    this.date = date
    this.path = path || this.getPath()
    this.valid = valid
    this.remote = remote
  }

  static new(id, remoteId, remote) {
    return new RemoteBackup(id, remoteId, Date.now(), null, remote.valid, remote)
  }

  getPath() {
    return Path.resolve(__dirname, '../../backups/remote', this.id + '.back')
  }

  toObject() {
    return {
      id: this.id,
      remoteId: this.remoteId,
      date: this.date,
      path: this.path,
      valid: this.valid,
      remote: this.remote
    }
  }

  static fromObject(object) {
    return new RemoteBackup(object.id, object.remoteId, object.date, object.path, object.valid, object.remote)
  }
}

module.exports = RemoteBackup