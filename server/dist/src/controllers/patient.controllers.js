"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByDoctorId = exports.getByCaretakerId = exports.getByOldAgeHomeId = exports.getById = exports.getAll = exports.create = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const types_1 = require("../utils/types");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const validationResult = types_1.PatientSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const patientData = validationResult.data;
        // Create new patient
        const [newPatient] = yield db_1.db
            .insert(schema_1.patientsTable)
            .values({
            name: patientData.name,
            age: patientData.age,
            gender: patientData.gender,
            bloodGroup: patientData.bloodGroup,
            contact: patientData.contact,
            medicalHistory: patientData.medicalHistory,
            oldAgeHomeId: patientData.oldAgeHomeId,
            assignedcaretakerId: patientData.assignedcaretakerId,
            assignedDoctorId: patientData.assignedDoctorId,
        })
            .returning()
            .execute();
        return res.status(201).json({
            message: "Patient created successfully",
            patient: newPatient
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.create = create;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield db_1.db
            .select()
            .from(schema_1.patientsTable)
            .execute();
        return res.status(200).json({
            message: "Patients retrieved successfully",
            patients
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAll = getAll;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const [patient] = yield db_1.db
            .select()
            .from(schema_1.patientsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.patientsTable.id, id))
            .execute();
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }
        return res.status(200).json({
            message: "Patient retrieved successfully",
            patient
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getById = getById;
const getByOldAgeHomeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldAgeHomeId = parseInt(req.params.oldAgeHomeId);
        if (isNaN(oldAgeHomeId)) {
            return res.status(400).json({ error: "Invalid old age home ID format" });
        }
        const patients = yield db_1.db
            .select()
            .from(schema_1.patientsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.patientsTable.oldAgeHomeId, oldAgeHomeId))
            .execute();
        return res.status(200).json({
            message: "Patients retrieved successfully",
            patients
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByOldAgeHomeId = getByOldAgeHomeId;
const getByCaretakerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caretakerId = parseInt(req.params.caretakerId);
        if (isNaN(caretakerId)) {
            return res.status(400).json({ error: "Invalid caretaker ID format" });
        }
        const patients = yield db_1.db
            .select()
            .from(schema_1.patientsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.patientsTable.assignedcaretakerId, caretakerId))
            .execute();
        return res.status(200).json({
            message: "Patients retrieved successfully",
            patients
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByCaretakerId = getByCaretakerId;
const getByDoctorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = parseInt(req.params.doctorId);
        if (isNaN(doctorId)) {
            return res.status(400).json({ error: "Invalid doctor ID format" });
        }
        const patients = yield db_1.db
            .select()
            .from(schema_1.patientsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.patientsTable.assignedDoctorId, doctorId))
            .execute();
        return res.status(200).json({
            message: "Patients retrieved successfully",
            patients
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByDoctorId = getByDoctorId;
