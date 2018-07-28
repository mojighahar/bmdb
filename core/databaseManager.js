const StorageManager = require('./storageManager')
const Database = require('./components/database')

var databases = []

class DatabaseManager {
  static init() {
    this.load()
  }

  static load() {
    var databaseList = StorageManager.read('databases')
    databaseList.forEach(database => {
      databases.push(Database.fromObject(database))
    })
  }

  static find(id) {
    for (var i = 0, database; database = databases[i]; i++) {
      if (database.id == id)
        return database
    }
  }

  static save() {
    var databaseList = []
    databases.forEach(database => {
      databaseList.push(database.toObject(database))
    })
    StorageManager.write('databases', databaseList)
  }
}

DatabaseManager.load()

module.exports = DatabaseManager