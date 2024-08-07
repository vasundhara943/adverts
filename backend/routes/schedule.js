import express from 'express';
import pool from '../config/connection.js';

const router = express.Router();

router.get("/get", (req, res) => {
    const query = "SELECT * FROM adverts.scheduling";
    try{
        pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/get/:searchDate", (req, res) => {
    const {searchDate} = req.params;
    const query = "SELECT * FROM adverts.scheduling WHERE ? BETWEEN startDate AND endDate";
    try{
        pool.query(query, [searchDate])
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/add", (req, res) => {
    const { tapeID, adMaster, startDate, startTime, endDate, endTime, frequency } = req.body;
    const query = `
        INSERT INTO adverts.scheduling (tapeID, adMaster, startDate, startTime, endDate, endTime, frequency)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        adMaster = VALUES(adMaster),
        startDate = VALUES(startDate),
        endDate = VALUES(endDate),
        endTime = VALUES(endTime),
        frequency = VALUES(frequency)
    `;

    try {
        pool.query(query, [tapeID, adMaster, startDate, startTime, endDate, endTime, frequency])
            .then((result) => {
                res.status(200).json({ message: "Schedule added or updated successfully" });
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { adMaster, startDate, startTime, endDate, endTime, frequency } = req.body;
    const query = "UPDATE adverts.scheduling SET adMaster = ?, startDate = ?, startTime = ?, endDate = ?, endTime = ?, frequency = ? WHERE id = ?";
    try {
        pool.query(query, [adMaster, startDate, startTime, endDate, endTime, frequency, id])
            .then((result) => {
                res.status(200).json({ message: "Schedule updated successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM adverts.scheduling WHERE id = ?";
    try {
        pool.query(query, [id])
            .then((result) => {
                res.status(200).json({ message: "Schedule deleted successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.delete("/deletefile/:fileDate", (req, res) => {
    const { fileDate } = req.params;
    const query = `DELETE FROM adverts.schedule_file WHERE fileDate = ?`;
    try {
        pool.query(query, [fileDate])
            .then((result) => {
                res.status(200).json({ message: "Records deleted successfully" });
            })
            .catch((err) => {
                console.log("Error: ", err);
                res.status(500).json({ message: err.message });
            });
    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/savefile", (req, res) => {
    const { id, fileDate, telecastTime, timebandName, requestedTimebandName, adType, tapeID, eventName, clientName, duration, contentType, productName, bookedProgram } = req.body;
    const query = `INSERT INTO adverts.schedule_file (id, fileDate, telecastTime, timebandName, requestedTimebandName, adType, tapeID, eventName, clientName, duration, contentType, productName, bookedProgram)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        pool.query(query, [id, fileDate, telecastTime, timebandName, requestedTimebandName, adType, tapeID, eventName, clientName, duration, contentType, productName, bookedProgram])
            .then((result) => {
                res.status(200).json({ message: "Schedule file saved successfully" });
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
                console.log("Error: ", err);
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error: ", err);
    }
});

router.get("/getfile", (req, res) => {
    const query = "SELECT *, DATE_FORMAT(fileDate, '%Y-%m-%d')  AS dateStr FROM adverts.schedule_file;";
    pool.query(query)
        .then((result) => {
            res.status(200).json({ data: result[0] });
        });
});

router.post("/getfilterfile/:date", (req, res) => {
    const { date } = req.params;
    const query = "SELECT *, DATE_FORMAT(fileDate, '%Y-%m-%d')  AS dateStr FROM adverts.schedule_file WHERE fileDate = ?;";
    try {
        pool.query(query, [date])
            .then((result) => {
                res.status(200).json({ data: result[0], message: "Schedule fetched successfully" });
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export default router;
