const express = require('express')
const router = express.Router()
const db = require('../lib/db')
//Customer
router.get('/' || '/home', (req, res) => {
  let result = Object.values(JSON.parse(JSON.stringify(req.cookies)));

  if (result.length === 0) {
    var sql = 'SELECT * FROM product';
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
      res.render('index', { title: 0, userData: data });
    });

  }
  else {
    var sql = 'SELECT * FROM product';
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
      res.render('index', { title: 1, userData: data });
    });

  }

})
router.get('/feedback', (req, res) => {
  const user = req.cookies.user
  if (user != undefined) {
    let result = Object.values(JSON.parse(JSON.stringify(req.cookies)));
    if (result.length === 0) {
        res.render('feedback', { title: 0 });
    }
    else {
        res.render('feedback', { title: 1});
    }
  }
  else {
    res.redirect('/signIn')
  }
})
router.post('/feedback/add',(req,res)=>{
  const com = req.body.COMMENT
  const cusNo = req.cookies.user
  var sql = `insert into comment (cusNo,comment)value ('${cusNo}', '${com}');`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.redirect('/home/feedback');
  });
})




module.exports = router