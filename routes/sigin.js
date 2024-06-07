const express = require('express')
const router = express.Router()
const db = require('../lib/db')
var app = express()
var cookieParser = require('cookie-parser')
app.use(cookieParser())
router.get('/', (req, res) => {
  res.clearCookie('C1')
  if(req.cookies != null){
    console.log('s')
  }
  else{
    console.log('u')
  }
  
  res.render('sign in',{ error: '' });
})


//login
router.post('/', (req, res) => {
  let id = req.body.id;
  let pass = req.body.password;
  var sql = `select * from cusdata where customerEmail = '${id}' or customerMobile = '${id}' and customerPassword = '${pass}';`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log(data)
    let result = Object.values(JSON.parse(JSON.stringify(data)));
    if(result.length != 0){
      let id = ''
      
      result.forEach((v) =>{
        id = v.customerNo;
      } );
      res.cookie(`user`, `${id}`)
      res.redirect('/')
    }
    else{
      res.render('sign in', { error: 'Invalid mobile number or email and password. Please try again.' });
    }
  });
})
router.get('/signOut', (req, res) => {
  res.clearCookie(`user`)
  res.redirect('/')
})


module.exports = router