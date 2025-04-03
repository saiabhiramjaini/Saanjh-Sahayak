"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const caretaker_routes_1 = __importDefault(require("./routes/caretaker.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const oldagehome_routes_1 = __importDefault(require("./routes/oldagehome.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const prescription_routes_1 = __importDefault(require("./routes/prescription.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/caretaker", caretaker_routes_1.default);
app.use("/api/v1/doctor", doctor_routes_1.default);
app.use("/api/v1/oldagehome", oldagehome_routes_1.default);
app.use("/api/v1/patient", patient_routes_1.default);
app.use("/api/v1/prescription", prescription_routes_1.default);
app.use("/api/v1/reports", reports_routes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`server running on http://localhost:${8000}`);
});
