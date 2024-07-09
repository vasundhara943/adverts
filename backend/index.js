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

app.post("/adtype/add",(req,res)=>{
    const {channel, adtype}=req.body;
    const query="INSERT INTO adverts.adtype (channel,adtype) VALUES (?,?)";
    try{
        pool.query(query,[channel,adtype])
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

app.get("/adtype/get",(req,res)=>{
    const query="SELECT * FROM adverts.adtype";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});


app.get("/admaster/get", (req,res) => {
    const query="SELECT * FROM adverts.admaster";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});

app.post("/admaster/add",(req,res)=>{
    const {channel, aname, adtype, filepath, startdate, enddate, active}=req.body;
    const query="INSERT INTO adverts.admaster (channel, name, adtype, filepath, startdate, enddate, active) VALUES (?,?,?,?,?,?,?)";
    try{
        pool.query(query,[channel,aname, adtype, filepath, startdate, enddate, active])
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




app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});
