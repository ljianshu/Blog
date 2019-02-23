//iframe流
let express = require('express')
let app = express()
app.use(express.static(__dirname))
app.get('/clock', function(req, res) {
  setInterval(function() {
    let date = new Date().toLocaleString()
    res.write(`
       <script type="text/javascript">
         parent.document.getElementById('clock').innerHTML = "${date}";
       </script>
     `)
  }, 1000)
})
app.listen(8080)
