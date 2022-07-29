const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyparser = require('body-parser')
const readXlsxFile = require('read-excel-file/node')
const mysql = require('mysql')
const multer = require('multer')
const cors = require('cors')
const app = express()
app.use(express.static('./public'))
app.use(cors({
    origin: '*'
}));
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  }),
)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'incidents',
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  },
})
const uploadFile = multer({ storage: storage })
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post('/import-excel', uploadFile.single('import-excel'), (req, res) => {
  importFileToDb(__dirname + '/uploads/' + req.file.filename)
  console.log(res)
})

app.get('/incidents', async(req, res) => {
    // db.connect((error) => {
    //     if (error) {
    //       console.error(error)
    //     } else {
      
            let query1 = 'SELECT * FROM incidents ORDER BY Created DESC'
            db.query(query1, (error, rows) => {
                
                if (error) throw err;
    
                
                res.send(rows)
                
            })
       // }
        
    })
  
function viewresults() {
    var resp
  
      
            let query1 = 'SELECT * FROM incidents'
            db.query(query1, (error, rows) => {
                db.release();
                if (error) throw err;
    
                console.log(rows.length);
                return rows
            })
     

}
function importFileToDb(exFile) {
  readXlsxFile(exFile).then((rows) => {
    rows.shift()
    
    
        let query = 'INSERT INTO incidents VALUES ?'
        db.query(query, [rows], (error, response) => {
          console.log(error || response)
        })
    
  })
  .catch(error=>{console.log(error)})
}
let nodeServer = app.listen(3000, function () {
  let port = nodeServer.address().port
  let host = nodeServer.address().address
  console.log('App working on: ', host, port)
})