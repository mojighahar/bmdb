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
  var stream = fs.createReadStream(path, {highWaterMark: process.env.STREAM_SPEED})
  stream.on('data', (data)=> {    
    res.write(data)
    stream.pause()
  })
  setInterval(()=> stream.resume() , 1000)
  stream.on('end', () => {
    stream.close()
    res.end()
    return
  })
})

module.exports = router;
