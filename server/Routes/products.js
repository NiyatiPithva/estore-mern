const express = require('express');
const products = express.Router();    //express is the method creates the main app
//const products = express.Router();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'niyati',
    database: 'estore',
    port: 3306,     //default port number of mysql
    multipleStatements: true
});

products.get("/",(req,res)=>{
    let productData;
     
    pool.query("select * from products;",(error,rows)=>{
        if(error){
            res.status(500).send(error);
        }
        else{
            productData = rows;
            res.status(200).send(productData);
        }
    })
})

module.exports = products;