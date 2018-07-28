const RemoteManager = require('../core/remoteManager')

module.exports = (data) => {
  RemoteManager.pull(data.remoteId)
}