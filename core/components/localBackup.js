const Path = require('path')
const fs = require('fs')

class LocalBackup {
  constructor(id, databaseId, date, path, valid = true) {
    this.id = id
    this.databaseId = databaseId
    this.date = date
    this.path = path || this.getPath()
    this.valid = valid
  }

  static new(id, databaseId) {
    return new LocalBackup(id, databaseId, Date.now())
  }

  getPath() {
    return Path.resolve(__dirname, '../../backups/local', this.id + '.back')
  }

  destroy() {
    try {
      fs.unlinkSync(this.path)
    } catch (error) { }
  }

  toObject() {
    return {
      id: this.id,
      databaseId: this.databaseId,
      date: this.date,
      path: this.path,
      valid: this.valid
    }
  }

  static fromObject(object) {
    return new LocalBackup(object.id, object.databaseId, object.date, object.path, object.valid)
  }
}

module.exports = LocalBackup