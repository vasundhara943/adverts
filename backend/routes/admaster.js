import express from 'express';
import pool from '../config/connection.js';

const router = express.Router();

router.get("/get", (req, res) => {
    const query = "SELECT * FROM adverts.admaster";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.post("/get/:searchDate", (req, res) => {
    const {searchDate} = req.params;
    const query = "SELECT * FROM adverts.admaster WHERE ? BETWEEN startDate AND endDate";
    try{
        pool.query(query, [searchDate])
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get("/getactive", (req, res) => {
    const query = "SELECT * FROM adverts.admaster WHERE active='Yes'";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.post("/add", (req, res) => {
    const { channel, aname, adtype, filePath, tapeID, startDate, endDate, active } = req.body;
    const query = "INSERT INTO adverts.admaster (channel, name, adtype, filepath, tapeID, startdate, enddate, active) VALUES (?,?,?,?,?,?,?,?)";
    try {
        pool.query(query, [channel, aname, adtype, filePath, tapeID, startDate, endDate, active])
            .then((result) => {
                res.status(200).json({ message: "Admaster added successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post("/update/:id", (req, res) => {
    const { id } = req.params;
    const { channel, aname, adtype, filePath, tapeID, startDate, endDate, active } = req.body;
    const query = "UPDATE adverts.admaster SET channel = ?, name = ?, adtype = ?, filepath = ?, tapeID = ?, startdate = ?, enddate = ?, active = ? WHERE id = ?";
    try {
        pool.query(query, [channel, aname, adtype, filePath, tapeID, startDate, endDate, active, id])
            .then((result) => {
                res.status(200).json({ message: "AdMaster updated successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM adverts.admaster WHERE id = ?";
    try {
        pool.query(query, [id])
            .then((result) => {
                res.status(200).json({ message: "Admaster deleted successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export default router;
