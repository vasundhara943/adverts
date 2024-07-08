import express from 'express';
import bodyParser from 'body-parser';
import pool from './config/connection.js';
import cors from 'cors';
const app = express();



app.use(cors());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.status(200).json({message:"Hello World"});
});

app.post("/add",(req,res)=>{
    const {cname, adtype}=req.body;
    const query="INSERT INTO advert.adtype (channel,adtype) VALUES (?,?)";
    try{
        pool.query(query,[cname,adtype])
        .then((result)=>{
            res.status(200).json({message:"Ad added successfully"});
        })
    }catch(err){
        res.status(500).json({message:err});
    }
    // pool.query(query,[channel,adtype])
    // .then((result)=>{
    //     res.status(200).json({message:"Ad added successfully"});
    // })
});

app.get("/get",(req,res)=>{
    const query="SELECT * FROM advert.adtype";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});





app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});

