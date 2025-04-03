import express from 'express';
import cors from 'cors';
import caretakerRouter from './routes/caretaker.routes';
import doctorRouter from './routes/doctor.routes';
import oldagehomeRouter from './routes/oldagehome.routes';
import patientRouter from './routes/patient.routes';
import prescriptionRouter from './routes/prescription.routes';
import reportsRouter from './routes/reports.routes';

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/caretaker", caretakerRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/oldagehome", oldagehomeRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/prescription", prescriptionRouter);
app.use("/api/v1/reports", reportsRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`server running on http://localhost:${8000}`);
})