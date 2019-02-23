//轮训
let express = require('express')
let app = express()
app.use(express.static(__dirname))
app.get('/clock', function(req, res) {
  res.end(new Date().toLocaleString())
})
app.listen(8080)
