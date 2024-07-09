// import express from 'express';

// const router = express.Router();

// router.get("/",(req,res)=>{
//     res.status(200).json({message:"Hello World"});
// });

// router.post("/add",(req,res)=>{
//     const {cname, adtype}=req.body;
//     const query="INSERT INTO adverts.adtype (channel,adtype) VALUES (?,?)";
//     try{
//         pool.query(query,[cname,adtype])
//         .then((result)=>{
//             res.status(200).json({message:"Ad added successfully"});
//         })
//     }catch(err){
//         res.status(500).json({message:err});
//     }
//     // pool.query(query,[channel,adtype])
//     // .then((result)=>{
//     //     res.status(200).json({message:"Ad added successfully"});
//     // })
// });

// router.get("/get",(req,res)=>{
//     const query="SELECT * FROM adverts.adtype";
//     pool.query(query)
//     .then((result)=>{
//         res.status(200).json({data:result[0]});
//     })
// });

// export default router;