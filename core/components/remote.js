const http = require('http')
const fs = require('fs')

const RemoteBackup = require('./remoteBackup')

class Remote {
  constructor(id, name, token, host, port = 65234) {
    this.id = id
    this.name = name
    this.token = token
    this.host = host
    this.port = port
  }

  getUpdates(lastId) {
    return new Promise((resolve, reject) => {
      http.get(`http://${this.host}:${this.port}/backup/getUpdates?startId=${lastId}&token=${this.token}`, (result) => {
        if (result.statusCode != 200)
          reject()

        var rawData = ''

        result.on('data', (data) => {
          rawData += data
        })

        result.on('end', () => {
          resolve(JSON.parse(rawData).updates)
        })

        result.on('error', reject)
      })
    })
  }

  download(id, path) {
    return new Promise((resolve, reject) => {
      var request = http.get(`http://${this.host}:${this.port}/backup/download/${id}?token=${this.token}`, (result) => {
        if (result.statusCode != 200)
          reject()
        var stream = fs.createWriteStream(path)

        result.on('data', (data) => {
          stream.write(data)
        })

        result.on('end', () => {
          stream.close()
          resolve()
        })

        request.on('error', reject)
      })
    })
  }

  static fromObject(object) {
    return new Remote(object.id, object.name, object.token, object.host, object.port)
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      token: this.token,
      host: this.host,
      port: this.port
    }
  }
}

module.exports = Remote