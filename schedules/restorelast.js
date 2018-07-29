const DatabaseManager = require('../core/databaseManager')
const RemoteManager = require('../core/remoteManager')

module.exports = async (data) => {
  var database = DatabaseManager.find(data.databaseId)
  var backups = RemoteManager.search(null, data.remoteId, data.remoteDatabaseId)    
  if(backups.length == 0)
    return
  var path = backups[backups.length - 1].path
  await database.driver.restore(path)
}