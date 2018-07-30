const RemoteManager = require('../core/remoteManager')

module.exports = (data) => {
  console.log('Starting RemoteBackup...')
  RemoteManager.pull(data.remoteId)
}