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
exports.getByReportId = exports.getById = exports.getAll = exports.create = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const types_1 = require("../utils/types");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against the schema
        const validationResult = types_1.PrescriptionSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const prescriptionData = validationResult.data;
        // Create new prescription
        const [newPrescription] = yield db_1.db
            .insert(schema_1.prescriptionsTable)
            .values({
            patientId: prescriptionData.patientId,
            doctorId: prescriptionData.doctorId,
            reportId: prescriptionData.reportId,
            medicines: prescriptionData.medicines,
        })
            .returning()
            .execute();
        // Update the report's verified status to true
        yield db_1.db
            .update(schema_1.reportsTable)
            .set({ verified: true })
            .where((0, drizzle_orm_1.eq)(schema_1.reportsTable.id, prescriptionData.reportId))
            .execute();
        return res.status(201).json({
            message: "Prescription created successfully",
            prescription: newPrescription
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
        const prescriptions = yield db_1.db
            .select()
            .from(schema_1.prescriptionsTable)
            .execute();
        return res.status(200).json({
            message: "Prescriptions retrieved successfully",
            prescriptions
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
        const [prescription] = yield db_1.db
            .select()
            .from(schema_1.prescriptionsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.id, id))
            .execute();
        if (!prescription) {
            return res.status(404).json({ error: "Prescription not found" });
        }
        return res.status(200).json({
            message: "Prescription retrieved successfully",
            prescription
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getById = getById;
const getByReportId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportId = parseInt(req.params.reportId);
        if (isNaN(reportId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const [prescription] = yield db_1.db
            .select()
            .from(schema_1.prescriptionsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.prescriptionsTable.reportId, reportId))
            .execute();
        if (!prescription) {
            return res.status(404).json({ error: "Prescription not found" });
        }
        return res.status(200).json({
            message: "Prescription retrieved successfully",
            prescription
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByReportId = getByReportId;
