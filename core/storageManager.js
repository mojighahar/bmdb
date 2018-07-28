const fs = require('fs')
const path = require('path')

class StorageManager {
  static read(name) {
    var location = this.getPath(name)
    if(!fs.existsSync(location))
      return []
    return JSON.parse(fs.readFileSync(location))
  }

  static write(name, data) {
    fs.writeFileSync(this.getPath(name), JSON.stringify(data))
  }

  static getPath(name) {
    return path.resolve(__dirname, '../storage', name + '.json')
  }
}

module.exports = StorageManager