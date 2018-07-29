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
  if (req.query.token != process.env.TOKEN)
    res.json({
      success: false,
      message: 'invalid_token'
    })
  var path = backupManager.find(req.params.id).path
  console.log('Reading path:' + path)
  var stream = fs.createReadStream(path)

  var interval = null
  var readed = stream.read(process.env.STREAM_SPEED)
  console.log(readed)
  res.write(readed)

  interval = setInterval(() => {
    readed = stream.read(process.env.STREAM_SPEED)
    if (readed == null) {
      clearInterval(interval)
      stream.close()
      console.log('THE END')
      res.end()
      return
    }
    console.log(readed)
    res.write(readed)
  }, 1000)
})

module.exports = router;
