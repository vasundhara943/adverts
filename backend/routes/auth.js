import express from 'express';
import pool from '../config/connection.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM adverts.users WHERE `email` = ? AND `password` = ? LIMIT 1";
    try {
        pool.query(query, [email, password])
            .then((result) => {
                if (result[0].length > 0) {
                    const id = result[0][0].email;
                    const token = jwt.sign({ id }, `${process.env.JWT}`, { expiresIn: "9999 years" });
                    res.status(200).json({ Login: true, token, data: result[0] });
                } else {
                    res.json({ Login: false });
                }
            });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

const verifyJwt = (req, res, next) => {
    const token = req.headers["access-token"];
    if (!token) {
        return res.json({ Login: false, message: "Login error. Retry." });
    } else {
        jwt.verify(token, process.env.JWT, (err, decoded) => {
            if (err) {
                res.json("Not Authenticated");
            } else {
                req.userEmail = decoded.email;
                next();
            }
        });
    }
};

router.get('/checkauth', verifyJwt, (req, res) => {
    return res.json("Authenticated");
});

export default router;
