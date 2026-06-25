const express = require('express');
const productCategories = express.Router();    //express is the method creates the main app
//const products = express.Router();
const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'niyati',
    database: 'estore',
    port: 3306,     //default port number of mysql
    multipleStatements: true
})


productCategories.get('/', (req, res) => {
    let categoryData;
    //      ****** WITHOUT GETCONNECTION **********
    pool.query("select * from categories",(error,category)=>{
        if(error){
            categoryData = error;
            res.status(500).send(categoryData);
        }else{
            categoryData = category;
            res.status(200).send(categoryData);
        }
    })



    //      ****** WITH GETCONNECTION **********
    // pool.getConnection((err, connection) => {
    //     if (err) {
    //         res.status(500).send("err" + err);
    //     }
    //     else {
    //         // res.status(200).send("Connection Established")
    //         pool.query("select * from categories",(error,category)=>{
    //             if(error){
    //                 categoryData = error;
    //                 res.status(500).send(categoryData);
    //             }else{
    //                 categoryData = category;
    //                 res.status(200).send(categoryData);
    //             }
    //         })
    //     }
    // })
})


module.exports= productCategories;
// module.exports = products;