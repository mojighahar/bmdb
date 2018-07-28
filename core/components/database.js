const path = require('path')

class Database {
  constructor(id, name, driver, data) {
    this.id = id
    this.name = name
    this._driver = driver
    this.data = data
  }

  get driver() {
    var Driver = this.requireDriver(this._driver)
    return Driver.fromDatabase(this)
  }

  requireDriver(name) {
    return require(path.resolve(__dirname, '../../drivers', name))
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      driver: this._driver,
      data: this.data
    }
  }

  static fromObject(object) {
    return new Database(object.id, object.name, object.driver, object.data)
  }
}

Database.DRIVERS = {
  MONGODB: 'mongodb'
}

module.exports = Database