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

// bank part

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

app.post('/api/tr_bank/bank_insert', (req, res) => {
    let sql = `INSERT INTO tsp60_nu_trdb.tr_bank ( ba_id, ba_balance_name, ba_name, ba_text, ba_status, ba_logo_bank, ba_logo_uni, ba_fee, ba_user_update,ba_bb_id, ba_update)
    VALUES (NULL,'${req.body.balance_name}',' ','${req.body.text}','${req.body.status}','NULL','NULL','0','0','${req.body.name}',CURRENT_TIMESTAMP)`;
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.json(result);
    });
});

// food type part

app.get('/foodtype', (req, res) => {
    let sql = 'SELECT *,(CASE WHEN ft_status = "Y" THEN "true" ELSE "false" END) AS check_status FROM tr_food_type;'
    let query = db.query(sql, (err, results) => {
        if (err) throw err
        res.json(results)
    })
})

app.post('/foodtype', (req, res) => {
    let sql = "INSERT INTO tr_food_type(" +
        "ft_name_th," +
        "ft_name_en," +
        "ft_status," +
        "ft_user_update)" +
        "VALUES('" +
        req.body.ft_name_th + "','" +
        req.body.ft_name_en + "','" +
        req.body.ft_status + "','" +
        req.body.ft_user_update + "'" +
        ");"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

app.delete('/foodtype/:id', (req, res) => {
    let sql = "DELETE FROM tr_food_type WHERE ft_id = " + req.params.id + ";"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
});
app.put('/foodtype/:id', (req, res) => {
    let sql = "UPDATE tr_food_type" +
        " SET ft_status = '" + req.body.ft_status + "'" +
        " WHERE ft_id = " + req.params.id + ";"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

app.put('/foodtype/update/:id', (req, res) => {
        let sql = "UPDATE tr_food_type" +
            " SET ft_name_th = '" + req.body.ft_name_th + "',ft_name_en = '" + req.body.ft_name_en + "'" +
            " WHERE ft_id = " + req.params.id + ";"
        let query = db.query(sql, (err, result) => {
            if (err) throw err
            res.json(result)
        })
    })
    // expert in part
app.post('/api/tr_expert_in/expert_in_insert', (req, res) => {
    let sql = `INSERT INTO tsp60_nu_trdb.tr_expert ( ep_id, ep_ps_id, ep_pf_id, ep_fname, ep_lname, ep_alp_id, ba_logo_uni, ba_fee, ba_user_update,ba_bb_id, ba_update)
    VALUES (NULL,'${req.body.balance_name}',' ','${req.body.text}','${req.body.status}','NULL','NULL','0','0','${req.body.name}',CURRENT_TIMESTAMP)`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.json(result);
    });
});

app.get('/expert_out', (req, res) => {
    let sql = 'SELECT * FROM tr_expert WHERE ep_ps_id=0;'
    let query = db.query(sql, (err, results) => {
        if (err) throw err
        res.json(results)
    })
})

app.put('/expert_out/status/:id', (req, res) => {
    let sql = "UPDATE tr_expert" +
        " SET ep_active = '" + req.body.ep_active + "'" +
        " WHERE ep_id = " + req.params.id + ";"
        let query = db.query(sql, (err, result) => {
            if (err) throw err
            res.json(result)
        })
})

app.put('/expert_out/update/:id', (req, res) => {
    let sql = "UPDATE tr_expert" +
        " SET ep_fname = '" + req.body.ep_fname + "',ep_lname = '" + req.body.ep_lname + "'" +
        " WHERE ep_id = " + req.params.id + ";"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

app.delete('/expert_out/delete/:id', (req, res) => {
    let sql = "DELETE FROM tr_expert WHERE ep_id = " + req.params.id + ";"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
});

app.post('/expert_out/expert_out_insert', (req, res) => {
    let sql = `INSERT INTO tr_expert (
        ep_id, ep_ps_id, ep_pf_id, ep_fname, ep_lname, ep_alp_id,
         ep_alp_other, ep_address, ep_dist_id, ep_amph_id, ep_pv_id,
          ep_zipcode, ep_email, ep_work_phone, ep_home_phone, ep_mobile_phone,
           ep_fax, ep_work_history, ep_active, ep_user_update, ep_show, ep_update)
    VALUES(NULL, 0, 1, '${req.body.ep_fname}', 
    '${req.body.ep_lname}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    '${req.body.ep_active}', 0,0 , CURRENT_TIMESTAMP)`;
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.json(result);
    });

});

app.post('/expert_out/insert/', (req, res) => {
    let sql = "INSERT INTO tr_expert(" +
        "ep_fname," +
        "ep_lname," +
        "ep_ps_id," +
        "ep_status," +
        "ep_pf_id," +
        "ep_alp_id," +
        "ep_address," +
        "ep_alp_other," +
        "ep_dist_id," +
        "ep_amph_id," +
        "ep_pv_id," +
        "ep_zipcode," + 
        "ep_email," +
        "ep_workphone," +
        "ep_home_phone," +
        "ep_mobile_phone," +
        "ep_fax," +
        "ep_work_history," +
        "ep_active," +
        "ep_show," +
        "ep_update" +
        "ep_user_update)" +
        "VALUES('" +
        req.body.ep_fname + "','" +
        req.body.ep_lname + "','" +
        reg.body.ep_ps_id + "','" +
        req.body.ep_status + "','" +
        req.body.ep_user_update + "'" +
        "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);"
    let query = db.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})