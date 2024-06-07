const express = require('express')
const router = express.Router()
const db = require('../lib/db')

router.get('/', (req, res) => {
  res.render('register', { aaa: '' });
})

//register
let num = '';
router.post('/', (req, res) => {
  let email = req.body.email;
  let mobile = req.body.mobile;
  let name = req.body.name;
  let pass = req.body.password;
  let pass2 = req.body.password2;
  console.log(email)
  if (email.length > 0) {
    let check = false;
    for (let i = 0; i < email.length; i++) {
      console.log(email[i])
      if (email[i] == '@') {

        check = true
        break
      }
    }
    if (check === false) {
      res.render('register', { aaa: 'Invalid address email missing @' })
      console.log('insert failed!!!')
    }
    else if (email.length === 0) {
      res.render('register', { aaa: 'Invalid email address' })
      console.log('insert failed!!!')
    }
    else if (mobile.length < 10 || mobile.length > 10) {
      res.render('register', { aaa: 'Invalid mobile number' })
      console.log('insert failed!!!')
    }
    else if (name.length === 0) {
      res.render('register', { aaa: 'Invalid name' })
      console.log('insert failed!!!')
    }
    else if (pass.length < 8 || pass != pass2) {
      res.render('register', { aaa: 'Invalid password' })
      console.log('insert failed!!!')
    }
    else {
      db.query('select count(customerNo) as num from  cusdata;', function (err, data, fields) {
        if (err) throw err;
        let result = Object.values(JSON.parse(JSON.stringify(data)));
        result.forEach((v) => {
          console.log(v.num)
          var sql = `INSERT INTO cusdata(customerNo, customerName, customerEmail, customerMobile, customerPassword) VALUES ('C${v.num}','${name}','${email}','${mobile}','${pass}');`;
          db.query(sql, function (err, data, fields) {
            if (err) throw err;
            console.log('insert complete!!!')

            res.render('register', { aaa: '' })

          });


        });


      });


    }

  }
  else if (email.length === 0) {
    res.render('register', { aaa: 'Invalid email address' })
    console.log('insert failed!!!')
  }
  else if (mobile.length < 10 || mobile.length > 10) {
    res.render('register', { aaa: 'Invalid mobile number' })
    console.log('insert failed!!!')
  }
  else if (name.length === 0) {
    res.render('register', { aaa: 'Invalid name' })
    console.log('insert failed!!!')
  }
  else if (pass.length < 8 || pass != pass2) {
    res.render('register', { aaa: 'Invalid password' })
    console.log('insert failed!!!')
  }
  else {
    db.query('select count(customerNo) as num from  cusdata;', function (err, data, fields) {
      if (err) throw err;
      let result = Object.values(JSON.parse(JSON.stringify(data)));
      result.forEach((v) => {
        var sql = `INSERT INTO cusdata(customerNo, customerName, customerEmail, customerMobile, customerPassword) VALUES ('C${v.num}','${name}','${email}','${mobile}','${pass}');`;
        db.query(sql, function (err, data, fields) {
          if (err) throw err;
          console.log('insert complete!!!')

          res.render('register', { aaa: '' })

        });


      });


    });


  }
  






})
module.exports = router