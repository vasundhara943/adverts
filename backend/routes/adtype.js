import express from 'express';
import pool from '../config/connection.js';

const router = express.Router();

router.get("/get", (req, res) => {
    const query = "SELECT * FROM adverts.adtype";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.get("/getadlist", (req, res) => {
    const query = "SELECT DISTINCT adtype FROM adverts.adtype";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.get("/getchannellist", (req, res) => {
    const query = "SELECT DISTINCT channel FROM adverts.adtype";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.post("/add", (req, res) => {
    const { channel, adtype } = req.body;
    const query = "INSERT INTO adverts.adtype (channel, adtype) VALUES (?, ?)";
    try {
        pool.query(query, [channel, adtype])
            .then((result) => {
                res.status(200).json({ message: "Ad added successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post("/update/:id", (req, res) => {
    const { id } = req.params;
    const { channel, adtype } = req.body;
    const query = "UPDATE adverts.adtype SET channel = ?, adtype = ? WHERE id = ?";
    try {
        pool.query(query, [channel, adtype, id])
            .then((result) => {
                res.status(200).json({ message: "Ad updated successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM adverts.adtype WHERE id = ?";
    try {
        pool.query(query, [id])
            .then((result) => {
                res.status(200).json({ message: "Adtype deleted successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export default router;
