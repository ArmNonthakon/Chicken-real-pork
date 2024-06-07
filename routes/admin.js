const express = require('express')
const router = express.Router()
const db = require('../lib/db')
const multer = require('multer')

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./public/img')
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+".png")
  }
})
const upload = multer({
  storage:storage
})

router.get('/', (req, res) => {
  db.query('select count(productNo)  as p from product', function (err, data, fields) {
    if (err) throw err;
    db.query("select count(customerNo) as c from cusdata ", function (err, data1, fields) {
      if (err) throw err;
      db.query("select count(empNo) as e from empdata ", function (err, data2, fields) {
        if (err) throw err;
        db.query("select count(orderNo) as o1 from orderdata where status = 'ordered';", function (err, data3, fields) {
          if (err) throw err;
          db.query("select count(orderNo) as o2 from orderdata where status = 'pending';", function (err, data4, fields) {
            if (err) throw err;
            db.query("select count(orderNo) as o3 from orderdata where status = 'complete';", function (err, data5, fields) {
              if (err) throw err;
              db.query("select sum(salary) as s from  empdata,departmentemp where empdata.departmentNo = departmentemp.departmentNo;", function (err, data6, fields) {
                if (err) throw err;
                db.query("select  sum(productAmount*price) as profit from orderdata,product where status = 'complete' and orderdata.productNo = product.productNo ;", function (err, data7, fields) {
                  if (err) throw err;
                  res.render('admin', {title: '', userData: data ,userData1 : data1,userData2 : data2,userData3 : data3
                  ,userData4 : data4,userData5 : data5,userData6 : data6,userData7 : data7});
                });
              });
            });
          });
        });
      });
    });
    
  });
})
router.get('/adminProduct', (req, res) => {
  var sql = 'SELECT * FROM product order by productNo;';
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('adminProduct', { title: '', userData: data });
  });

})
router.get('/adminOrder', (req, res) => {
  var sql = 'select * from orderdata,product where orderdata.productNo = product.productNo and status = "pending";';
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('adminOrder', { title: '', userData: data });
  });


})
router.get('/adminEmployee', (req, res) => {
  var sql = 'select * from empdata,departmentEmp where empdata.departmentNo = departmentEmp.departmentNo;';
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('adminEmployee', { title: '', userData: data });
  });
})
router.get('/addEmployee', (req, res) => {
  res.render('addAdminEmployee')
})
router.post('/addEmployee', (req, res) => {
  db.query('select count(empNo) as num from  empdata;', function (err, data, fields) {
    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mobile
    const department = req.body.department
    if (err) throw err;
    let result = Object.values(JSON.parse(JSON.stringify(data)));
    result.forEach((v) => {
      console.log(v.num)
      var sql = `INSERT INTO empdata(empNo, empName, empEmail, mobileNumber, departmentNo) VALUES ('${v.num+1001}','${name}','${email}','${mobile}','${department}');`;
      db.query(sql, function (err, data, fields) {
        if (err) throw err;
        console.log('insert complete!!!')
        res.redirect('/admin/adminEmployee')
      });
    });
  });
})
router.post('/delEmployee', (req, res) => {
      const no = req.body.no
      db.query(`delete from empdata where empNo = '${no}';`, function (err, data, fields) {
        if (err) throw err;
          res.redirect('/admin/adminEmployee')
      });
  
})


router.get('/addProduct', (req, res) => {
  res.render('addAdminProduct.ejs')
})
router.post('/addProduct',upload.single("image"), (req, res) => {
  db.query('select count(productNo) as num from  product;', function (err, data, fields) {
    const name = req.body.name
    const price = req.body.price
    const type = req.body.type
    const image = req.file.filename
    if (err) throw err;
    let result = Object.values(JSON.parse(JSON.stringify(data)));
    result.forEach((v) => {
      var sql = `INSERT INTO product(productNo, productName, price, productType, image) VALUES ('p${v.num+1001}','${name}',${price},'${type}','${image}');`;
      db.query(sql, function (err, data, fields) {
        if (err) throw err;
        console.log('insert complete!!!')
        res.redirect('/admin/adminProduct')
      });
    });
  });
})



router.post('/delProduct', (req, res) => {
      const no = req.body.no
      db.query(`delete from product where productNo = '${no}';`, function (err, data, fields) {
        if (err) throw err;
          res.redirect('/admin/adminProduct')
      });
  
})


router.post('/orderComplete', (req, res) => {
  const no = req.body.no
  const number = req.body.number
  var sql = `UPDATE orderdata SET status = 'complete' WHERE orderNo = '${no}' and status = 'pending' and number =${number};`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log('Order complete!!!')
    res.redirect('/admin/adminOrder')
    
  });

})
router.get('/comment',(req,res)=>{
  var sql = `select cusdata.customerNo,cusdata.customerName,cusdata.customerEmail,comment.comment from cusdata,comment where cusdata.customerNo = comment.cusNo;`;
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('comment',{userData: data})

    
  });
  

})










module.exports = router;