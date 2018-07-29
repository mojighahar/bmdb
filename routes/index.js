var express = require('express');
var router = express.Router();
var fs = require('fs')
require('dotenv').config()

const backupManager = require('../core/backupManager')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/backup/getUpdates', function (req, res, next) {
  console.log(req.query.token)
  console.log(process.env.TOKEN)
  if (req.query.token != process.env.TOKEN)
    res.json({
      success: false,
      message: 'invalid_token'
    })
  var updates = backupManager.getUpdates(req.query.startId)
  res.json({
    success: true,
    updates: updates
  })
})

router.get('/backup/download/:id', function (req, res, next) {
  console.log(req.query.token)
  if (req.query.token != process.env.TOKEN)
    res.json({
      success: false,
      message: 'invalid_token'
    })
  var path = backupManager.find(req.params.id).path
  var stream = fs.createReadStream(path)

  var interval = null
  interval = setInterval(() => {
    var readed = stream.read(process.env.STREAM_SPEED)
    if (readed == null) {
      clearInterval(interval)
      stream.close()
      res.end()
      return
    }
    res.write(readed)
  }, 1000)
})

module.exports = router;
