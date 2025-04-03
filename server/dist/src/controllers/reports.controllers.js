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
exports.getByDoctorId = exports.getByCaretakerId = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const types_1 = require("../utils/types");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const validationResult = types_1.ReportSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const reportData = validationResult.data;
        // Create new report
        const [newReport] = yield db_1.db
            .insert(schema_1.reportsTable)
            .values({
            symptoms: reportData.symptoms,
            detailedAnalysis: reportData.detailedAnalysis,
            precautions: reportData.precautions,
            typeOfDoctors: reportData.typeOfDoctors,
            predictions: reportData.predictions,
            patientId: reportData.patientId,
            caretakerId: reportData.caretakerId,
            doctorId: reportData.doctorId,
            verified: reportData.verified,
        })
            .returning()
            .execute();
        return res.status(201).json({
            message: "Report created successfully",
            report: newReport
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
        const reports = yield db_1.db
            .select()
            .from(schema_1.reportsTable)
            .execute();
        return res.status(200).json({
            message: "Reports retrieved successfully",
            reports
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
        const [report] = yield db_1.db
            .select()
            .from(schema_1.reportsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.id, id))
            .execute();
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        return res.status(200).json({
            message: "Report retrieved successfully",
            report
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getById = getById;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const [report] = yield db_1.db
            .select()
            .from(schema_1.reportsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.id, id))
            .execute();
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }
        // Update report
        const [updatedReport] = yield db_1.db
            .update(schema_1.reportsTable)
            .set({
            verified: req.body.verified,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.id, id))
            .returning()
            .execute();
        return res.status(200).json({
            message: "Report updated successfully",
            report: updatedReport
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.update = update;
const getByCaretakerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caretakerId = parseInt(req.params.caretakerId);
        if (isNaN(caretakerId)) {
            return res.status(400).json({ error: "Invalid caretaker ID format" });
        }
        const reports = yield db_1.db
            .select({
            id: schema_1.reportsTable.id,
            patientId: schema_1.reportsTable.patientId,
            patient: {
                name: schema_1.patientsTable.name,
            },
            detailedAnalysis: schema_1.reportsTable.detailedAnalysis,
            verified: schema_1.reportsTable.verified,
            createdAt: schema_1.reportsTable.createdAt,
        })
            .from(schema_1.reportsTable)
            .leftJoin(schema_1.patientsTable, (0, drizzle_orm_1.eq)(schema_1.reportsTable.patientId, schema_1.patientsTable.id))
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.caretakerId, caretakerId))
            .orderBy(schema_1.reportsTable.createdAt)
            .execute();
        return res.status(200).json({
            message: "Reports retrieved successfully",
            reports
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
            return res.status(400).json({ error: "Invalid caretaker ID format" });
        }
        const reports = yield db_1.db
            .select({
            id: schema_1.reportsTable.id,
            patientId: schema_1.reportsTable.patientId,
            patient: {
                name: schema_1.patientsTable.name,
            },
            detailedAnalysis: schema_1.reportsTable.detailedAnalysis,
            verified: schema_1.reportsTable.verified,
            createdAt: schema_1.reportsTable.createdAt,
        })
            .from(schema_1.reportsTable)
            .leftJoin(schema_1.patientsTable, (0, drizzle_orm_1.eq)(schema_1.reportsTable.patientId, schema_1.patientsTable.id))
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.doctorId, doctorId))
            .orderBy(schema_1.reportsTable.createdAt)
            .execute();
        return res.status(200).json({
            message: "Reports retrieved successfully",
            reports
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByDoctorId = getByDoctorId;
