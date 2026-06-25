const express = require('express');
const registration = express.Router();    //express is the method creates the main app
//const products = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'niyati',
    database: 'estore',
    port: 3306,     //default port number of mysql
    multipleStatements: true
});
registration.get("/", (req, res) => {
    res.send("Registration endpoint is working!");
});

registration.post("/", (req, res) => {

    const { name, mobileno, email, password } = req.body;

    console.log("req.body", req.body)

    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            console.log("err in salt",err);
        }
        console.log("salt....",salt);
        bcrypt.hash(password,salt,(err,hash)=>{

            if(err){
                console.log("err in hash",hash);
            }
            console.log("hash.....",hash)
            const sql = "insert into registration (name,mobileno,email,password) values (?,?,?,?)";
            console.log("sql..",sql);
            pool.query(
                sql,
                 [
                    name, 
                    mobileno, 
                    email, 
                    hash,
                ],
                (error, result) => {
                if (error) {
                    
                    return res.status(500).json({ error: "Database error" });
                }
                else {
                    let token = jwt.sign({email : email},"priv@te123");
                    res.cookie("token",token);
                    return res.status(200).json({ message: "Registered successfully" });
                }
            })        
        })
    })
})

module.exports = registration;