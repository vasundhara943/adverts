import express from 'express';
import pool from '../config/connection.js';

const router = express.Router();

router.get("/get", (req, res) => {
    const query = "SELECT * FROM adverts.asrunlog";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.post("/get/:searchDate", (req, res) => {
    const {searchDate} = req.params;
    const query = "SELECT * FROM adverts.asrunlog WHERE telecastDate = ?";
    try {pool.query(query, [searchDate])
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});


export default router;