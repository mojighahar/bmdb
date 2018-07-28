const MongoClient = require('mongodb').MongoClient;
const { exec } = require('child_process')

class MongoDB {
  constructor(host, port,username, password, database, authenticationDatabase) {
    this.host = encodeURIComponent(host)
    this.port = encodeURIComponent(port)
    this.username = encodeURIComponent(username)
    this.password = encodeURIComponent(password)
    this.database = encodeURIComponent(database)
    if (authenticationDatabase)
      this.authenticationDatabase = encodeURIComponent(authenticationDatabase)

  }

  get connectionString() {
    return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/‍${this.database}?authSource=${this.authenticationDatabase || this.database}`
  }

  async connect() {
    this.connection = await MongoClient.connect(this.connectionString)
  }

  backup(path) {    
    return new Promise((resolve, reject) => {
      console.log(`mongodump --username=${this.username} --password ${this.password} --host ${this.host}:${this.port} --authenticationDatabase ${this.authenticationDatabase} --archive=${path}`);
      
      exec(`mongodump --username=${this.username} --password ${this.password} --host ${this.host}:${this.port} --authenticationDatabase ${this.authenticationDatabase} --archive=${path}`, (error, stderr, stdout) => {
        if(error) {
          console.log(error)
          reject(error)
          return
        }
        if(stderr) {
          console.log(stderr)
          reject(stderr)
          return
        }
        console.log(stdout)
        resolve()
      })
    })
  }

  restore(path) {  
    return new Promise((resolve, reject) => {
      exec(`mongorestore --drop  --username=${this.username} --password=${this.password} --host ${this.host}:${this.port} --authenticationDatabase=${this.authenticationDatabase} --archive=${path}`, (error, stderr, stdout) => {
        if(error) {
          console.log(error)
          reject(error)
          return
        }
        if(stderr) {
          console.log(stderr)
          reject(stderr)
          return
        }
        console.log(stdout)
        resolve()
      })
    })
  }

  static fromDatabase(database) {
    return new MongoDB(database.data.host,
      database.data.port,
      database.data.username,
      database.data.password,
      database.data.name,
      database.data.authenticationDatabase
    )
  }
}

module.exports = MongoDB