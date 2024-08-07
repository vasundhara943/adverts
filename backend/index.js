import express, { response } from 'express';
import bodyParser from 'body-parser';
import pool from './config/connection.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import AdTypeRoutes from './routes/adtype.js';
import AdMasterRoutes from './routes/admaster.js';
import ScheduleRoutes from './routes/schedule.js';
import AuthRoutes from './routes/auth.js';
import AsRunLogRoutes from './routes/asrunlog.js';

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/adtype", AdTypeRoutes);
app.use("/admaster", AdMasterRoutes);
app.use("/schedule", ScheduleRoutes);
app.use("/login", AuthRoutes);
app.use("/asrunlog", AsRunLogRoutes);

app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});
