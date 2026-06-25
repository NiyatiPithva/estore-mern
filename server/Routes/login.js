const express = require('express');
const login = express.Router();

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'niyati',
    database : 'estore',
    port : 3306,
    multipleStatements : true,
})
login.get("/",(req,res)=>{
    res.send("Yeah!!,It's Absolutely Working!!")
})

login.post("/",(req,res)=>{
    const { email, password } = req.body;
    const sql = "select * from registration where email=?";

    pool.query(sql,[email], (error,result)=>{
        
        if(error){
            return res.status(500).json({error : "Database Error"});
        }
        if(result.length == 0){
            return res.status(401).json({ error: 'Invaild Email or Password'})
        }

        const user = result[0];
        //console.log("user....",result)
        bcrypt.compare(password,user.password,(err,isMatch)=>{
            
            if (err) {
                return res.status(500).json({ error: "Error comparing passwords" });
            }

            if (isMatch) {
                
                let token = jwt.sign(email,"priv@te123");
                console.log("token...",token);
                
                res.cookie("token",token);

                return res.status(200).json({ message: "Login Successful" });
            } else {
                return res.status(401).json({ error: "Invalid Email or Password" });
            }
        })
    } )
})

module.exports = login;