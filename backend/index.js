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



app.get("/adtype/get",(req,res)=>{
    const query="SELECT * FROM adverts.adtype";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});

app.get("/adtype/getadlist",(req,res)=>{
    const query="SELECT DISTINCT adtype FROM adverts.adtype";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});

app.get("/adtype/getchannellist",(req,res)=>{
    const query="SELECT DISTINCT channel FROM adverts.adtype";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
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
});

app.post("/adtype/update/:id",(req,res)=>{
    const {id} = req.params;
    const {channel, adtype}=req.body;
    const query="UPDATE adverts.adtype SET channel=? , adtype=? WHERE id = ?";
    try{
        pool.query(query,[channel,adtype, id])
        .then((result)=>{
            res.status(200).json({message:"Ad updated successfully"});
        })
    }catch(err){
        res.status(500).json({message:err});
    }
});

app.delete("/adtype/delete/:id", (req, res) =>{
    const {id} = req.params;
    const query = "DELETE FROM adverts.adtype WHERE id = ?";
    try {
      pool.query(query, [id])
        .then((result) => {
          res.status(200).json({ message: "Adtype deleted successfully" });
        })
    } catch (err) {
      res.status(500).json({ message: err });
    }
});



app.get("/admaster/get", (req,res) => {
    const query="SELECT * FROM adverts.admaster";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});

app.post("/admaster/add",(req,res)=>{
    const {channel, aname, adtype, filePath, startDate, endDate, active}=req.body;
    //console.log(channel, aname, adtype, filePath, startDate, endDate, active);
    const query="INSERT INTO adverts.admaster (channel, name, adtype, filepath, startdate, enddate, active) VALUES (?,?,?,?,?,?,?)";
    try{
        pool.query(query,[channel,aname, adtype, filePath, startDate, endDate, active])
        .then((result)=>{
            res.status(200).json({message:"Admaster added successfully"});
        })
    }catch(err){
        res.status(500).json({message:err});
    }
});

app.post("/admaster/update/:id", (req, res) => {
    const { id } = req.params;
    const { channel, aname, adtype, filePath, startDate, endDate, active } = req.body;
    const query = "UPDATE adverts.admaster SET channel=?, name=?, adtype=?, filepath=?, startdate=?, enddate=?, active = ? WHERE id = ?";
    try {
      pool.query(query, [channel, aname, adtype, filePath, startDate, endDate, active, id])
        .then((result) => {
          res.status(200).json({ message: "AdMaster updated successfully" });
        })
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  app.delete("/admaster/delete/:id", (req, res) =>{
    const {id} = req.params;
    const query = "DELETE FROM adverts.admaster WHERE id = ?";
    try {
      pool.query(query, [id])
        .then((result) => {
          res.status(200).json({ message: "Admaster deleted successfully" });
        })
    } catch (err) {
      res.status(500).json({ message: err });
    }
});


app.get("/schedule/get", (req,res) => {
    const query="SELECT * FROM adverts.scheduling";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
});

app.post("/schedule/add",(req,res)=>{
    const {adMaster, startDate, startTime, endDate, endTime, frequency}=req.body;
    //console.log(channel, aname, adtype, filePath, startDate, endDate, active);
    const query="INSERT INTO adverts.scheduling (adMaster, startDate, startTime, endDate, endTime, frequency) VALUES (?,?,?,?,?,?)";
    try{
        pool.query(query,[adMaster, startDate, startTime, endDate, endTime, frequency])
        .then((result)=>{
            res.status(200).json({message:"Schedule added successfully"});
        })
    }catch(err){
        res.status(500).json({message:err});
    }
});

app.put("/schedule/update/:id", (req, res) => {
    const { id } = req.params;
    const { adMaster, startDate, startTime, endDate, endTime, frequency } = req.body;
    const query = "UPDATE adverts.scheduling SET adMaster = ?, startDate = ?, startTime = ?, endDate = ?, endTime = ?, frequency = ? WHERE id = ?";
    try {
      pool.query(query, [adMaster, startDate, startTime, endDate, endTime, frequency, id])
        .then((result) => {
          res.status(200).json({ message: "Schedule updated successfully" });
        })
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

app.delete("/schedule/delete/:id", (req, res) =>{
    const {id} = req.params;
    const query = "DELETE FROM adverts.scheduling WHERE id = ?";
    try {
      pool.query(query, [id])
        .then((result) => {
          res.status(200).json({ message: "Schedule deleted successfully" });
        })
    } catch (err) {
      res.status(500).json({ message: err });
    }
});

app.get("/asrunlog/get", (req, res) => {
  const query="SELECT * FROM adverts.asrunlog";
    pool.query(query)
    .then((result)=>{
        res.status(200).json({data:result[0]});
    })
})


app.post('/login', (req, res) => {
  db.execute(
         (err, result)=> {
             if (result.length > 0) {
                 bcrypt.compare(password, result[0].password, (error, response) => {
                     if (response) {
                         const id = result[0].id
                         const token = jwt.sign({id}, "jwtSecret", {
                             expiresIn: 300,
                         })
                         req.session.user = result;
                         res.send(result);
                     }
                 });
             }
         }
     );
 });


app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});
