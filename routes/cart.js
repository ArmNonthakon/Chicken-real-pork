const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
  const user = req.cookies.user
  if (user != undefined) {
    let result = Object.values(JSON.parse(JSON.stringify(req.cookies)));
    if (result.length === 0) {
      var sql = 'select * from orderdata,product where orderdata.productNo = product.productNo ; ';
      db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('cart', { title: 0, userData: data });
      });

    }
    else {
      var sql = 'select * from orderdata,product where orderdata.productNo = product.productNo  and status = "ordered"; ';
      db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('cart', { title: 1, userData: data });
      });

    }

  }
  else {
    res.redirect('/signIn')
  }



})
router.post('/addCart', (req, res) => {
  const c = ""
  const pNo = req.body.no
  const amount = req.body.amount
  const user = req.cookies.user
  if (amount === "") {
    res.redirect('/')
  }
  else if (user != undefined) {
      console.log(c)
      var sql1 = 'select * from presentOrder;'
      db.query(sql1, function (err, data, fields) {
        if (err) throw err;
        let result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => {
          var sql = `INSERT INTO orderdata(orderNo, productNo, productAmount, customerNo, number,status) VALUES ('OD${v.presentOrder + 1000}','${pNo}',${amount},'${user}',${v.num},'ordered');`;
          db.query(sql, function (err, data, fields) {
            if (err) throw err;
            console.log('insert complete!!!')
            res.redirect('/')
            db.query(`UPDATE presentOrder SET num = ${v.num + 1} WHERE id = 'present';`, function (err, data, fields) {
              if (err) throw err;

            });
          });

        });
      });
  }
  else {
    res.redirect('/signIn')
  }
})
router.get('/orderComplete', (req, res) => {
  var sql = `UPDATE orderdata SET status = 'pending' WHERE status = 'ordered';`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log('Order complete!!!')
    res.redirect('/cart')
    db.query('select * from presentOrder;', function (err, data, fields) {
      if (err) throw err;
      let result = Object.values(JSON.parse(JSON.stringify(data)));
      result.forEach((v) => {
        db.query(`UPDATE presentOrder SET presentOrder = ${v.presentOrder + 1}  WHERE id = 'present';`, function (err, data, fields) {
          if (err) throw err;

        });
        db.query(`UPDATE presentOrder SET num = 1  WHERE id = 'present';`, function (err, data, fields) {
          if (err) throw err;

        });
      });
    });


  });

})
router.post('/del',(req,res)=>{
  const no = req.body.no
  db.query(`delete from orderdata where number = ${no};`, function (err, data, fields) {
    if (err) throw err;
      res.redirect('/cart')
  });
})
router.post('/changeAmount',(req,res)=>{
  const num = req.body.num
  const no = req.body.no
  console.log(num)
  db.query(`UPDATE orderdata SET productAmount = ${num}  WHERE number = ${no};`, function (err, data, fields) {
    if (err) throw err;
      res.redirect('/cart')
  });
})




module.exports = router
