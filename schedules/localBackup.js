const DatabaseManager = require('../core/databaseManager')
const BackupManager = require('../core/backupManager')

module.exports = (data) => {
  var database = DatabaseManager.find(data.databaseId)
  BackupManager.take(database)
}