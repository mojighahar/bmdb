const MongoClient = require('mongodb').MongoClient;
const { exec } = require('child_process')

class MongoDB {
  constructor(host, port,username, password, database, authenticationDatabase) {
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.database = database
    this.authenticationDatabase = authenticationDatabase?
      authenticationDatabase : this.database

  }

  get connectionString() {
    return `mongodb://${this.username}:${this.password}@${this.host}:${this.port}/‍${this.database}?authSource=${this.authenticationDatabase || this.database}`
  }

  async connect() {
    this.connection = await MongoClient.connect(this.connectionString)
  }

  backup(path) {    
    return new Promise((resolve, reject) => {      
      exec(`mongodump --username=${this.username} --password ${this.password} --host ${this.host}:${this.port} --db ${this.database} --authenticationDatabase ${this.authenticationDatabase} --archive=${path}`, (error, stderr, stdout) => {
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
      exec(`mongorestore --username=${this.username} --password=${this.password} --host ${this.host}:${this.port} --db ${this.database} --authenticationDatabase=${this.authenticationDatabase} --drop --archive=${path}`, (error, stderr, stdout) => {
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