require('dotenv').config();
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var mysql = require('mysql')
var db = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

db.connect((err) => {
    if (err) throw err;
    console.log("connected")
})

app.listen(3000, () => {
    console.log('Start server at port 3000.');
});

app.get('/api/tr_bank', (req, res) => {
    let sql = 'SELECT * FROM tsp60_nu_trdb.tr_bank;';
    db.query(sql, (err, result) => {
        if (err) throw (err); 
        res.json(result); 
    });
});

app.get('/api/tr_bank/:id', (req, res) => {
    let sql = `SELECT * FROM tsp60_nu_trdb.tr_bank WHERE ba_id = ${req.params.id}`;
    db.query(sql, (err, result) => { 
        if (err) throw (err); 
        res.json(result); 
    });
});

app.post('/api/tr_bank/bank_insert', (req,res)=>{
    let sql = `INSERT INTO tsp60_nu_trdb.tr_bank ( ba_id, ba_balance_name, ba_name, ba_text, ba_status, ba_logo_bank, ba_logo_uni, ba_fee, ba_user_update,ba_bb_id, ba_update)
    VALUES (NULL,'${req.body.balance_name}',' ','${req.body.text}','${req.body.status}','NULL','NULL','0','0','${req.body.name}',CURRENT_TIMESTAMP)`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) throw (err); 
        res.json(result); 
    });
});

// app.get('/api/search_by_name/:name', (req, res) => {
    // res.send('Hello world Post ' + req.body.id);
//     let name = req.params.name;
//     let sql = `SELECT * FROM customers WHERE customerName LIKE '%${name}%'`;
//     db.query(sql, function(err, result) {
//         if (err) throw (err);
//         res.json(result);
//     });
// });

// app.post('/customers/', (req, res) => {
//     let sql = "INSERT INTO customers(" +
//         "customerName," +
//         "contactLastName," +
//         "contactFirstName," +
//         "phone," +
//         "addressLine1," + 
//         "addressLine2," +
//         "city," +
//         "state," +
//         "postalCode," +
//         "country," +
//         "salesRepEmployeeNumber," +
//         "creditLimit)" +
//         "VALUES('" +
//         req.body.customerName + "','" +
//         req.body.contactLastName + "','" +
//         req.body.contactFirstName + "','" +
//         req.body.phone + "','" +
//         req.body.addressLine1 + "','" +
//         req.body.addressLine2 + "','" +
//         req.body.city + "','" +
//         req.body.state + "','" +
//         req.body.postalCode + "','" +
//         req.body.country + "','" +
//         req.body.salesRepEmployeeNumber + "','" +
//         req.body.creditLimit + "'" +
//         ");"
//     let query = db.query(sql, (err, result) => {
//         if (err) throw err
//         res.json(result)
//     })
// });

// app.put('/api/customers/update', (req, res) => {
//     let sql = `UPDATE customers SET customerName = ?, contactLastName = ?, contactFirstName = ?, phone = ?, addressLine1 = ?, addressLine2 = ?, city = ?, state = ? , postalCode = ? , country = ? , salesRepEmployeeNumber = ? , creditLimit = ? WHERE customerNumber = ?`;
//     let data = Array(
//         req.body.customerName, req.body.contactLastName, req.body.contactFirstName,
//         req.body.phone, req.body.addressLine1, req.body.addressLine2,
//         req.body.city, req.body.state, req.body.postalCode,
//         req.body.country, req.body.saleRepEmployeeNumber, req.body.creditLimit,
//         req.body.customerNumber
//     )
//     db.query(sql, [...data], (err, result) => {
//         if (err) throw (err);
//         res.json(result);
//     });
// });

// app.delete('/api/delete/:id', (req, res) => {
//     let sql = `DELETE FROM customers WHERE customerNumber = ${req.params.id}`;
//     db.query(sql, (err, result) => {
//         if (err) throw (err);
//         res.json(result);
//     });
// });