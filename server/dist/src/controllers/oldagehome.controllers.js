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
exports.getByDoctorId = exports.getByCaretakerId = exports.getById = exports.create = void 0;
const types_1 = require("../utils/types");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = types_1.OldAgeHomeSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationResult.error.flatten().fieldErrors,
            });
        }
        const oldAgeHomeData = validationResult.data;
        // Check if caretaker exists
        const [caretaker] = yield db_1.db
            .select()
            .from(schema_1.caretakersTable)
            .where((0, drizzle_orm_1.eq)(schema_1.caretakersTable.id, oldAgeHomeData.assignedCaretakerId))
            .execute();
        if (!caretaker) {
            return res.status(404).json({ error: "Caretaker not found" });
        }
        // Check if doctor exists
        const [doctor] = yield db_1.db
            .select()
            .from(schema_1.doctorsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.doctorsTable.id, oldAgeHomeData.assignedDoctorId))
            .execute();
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        // Check if caretaker already has an old age home
        const [existingHome] = yield db_1.db
            .select()
            .from(schema_1.oldAgeHomesTable)
            .where((0, drizzle_orm_1.eq)(schema_1.oldAgeHomesTable.assignedcaretakerId, oldAgeHomeData.assignedCaretakerId))
            .execute();
        if (existingHome) {
            return res.status(409).json({ error: "Caretaker already has an assigned old age home" });
        }
        // Create new old age home
        const [newOldAgeHome] = yield db_1.db
            .insert(schema_1.oldAgeHomesTable)
            .values({
            name: oldAgeHomeData.name,
            phoneNumber: oldAgeHomeData.phoneNumber,
            address: oldAgeHomeData.address,
            city: oldAgeHomeData.city,
            state: oldAgeHomeData.state,
            pincode: oldAgeHomeData.pincode,
            currentOccupancy: oldAgeHomeData.currentOccupancy,
            assignedcaretakerId: oldAgeHomeData.assignedCaretakerId,
            assignedDoctorId: oldAgeHomeData.assignedDoctorId,
        })
            .returning()
            .execute();
        return res.status(201).json({
            message: "Old age home created successfully",
            oldAgeHome: newOldAgeHome
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.create = create;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        const [oldAgeHome] = yield db_1.db
            .select()
            .from(schema_1.oldAgeHomesTable)
            .where((0, drizzle_orm_1.eq)(schema_1.oldAgeHomesTable.id, id))
            .execute();
        if (!oldAgeHome) {
            return res.status(404).json({ error: "Old age home not found" });
        }
        return res.status(200).json({
            message: "Old age home retrieved successfully",
            oldAgeHome
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getById = getById;
const getByCaretakerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const caretakerId = parseInt(req.params.caretakerId);
        if (isNaN(caretakerId)) {
            return res.status(400).json({ error: "Invalid caretaker ID format" });
        }
        const [oldAgeHome] = yield db_1.db
            .select()
            .from(schema_1.oldAgeHomesTable)
            .where((0, drizzle_orm_1.eq)(schema_1.oldAgeHomesTable.assignedcaretakerId, caretakerId))
            .execute();
        if (!oldAgeHome) {
            return res.status(404).json({ error: "No old age home found for this caretaker" });
        }
        return res.status(200).json({
            message: "Old age home retrieved successfully",
            oldAgeHome
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
        const oldAgeHomes = yield db_1.db
            .select()
            .from(schema_1.oldAgeHomesTable)
            .where((0, drizzle_orm_1.eq)(schema_1.oldAgeHomesTable.assignedDoctorId, doctorId))
            .execute();
        if (oldAgeHomes.length === 0) {
            return res.status(404).json({ error: "No old age homes found for this doctor" });
        }
        return res.status(200).json({
            message: "Old age homes retrieved successfully",
            oldAgeHomes, // Now returning an array
        });
    }
    catch (e) {
        console.error(`Error: ${e.message || e}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getByDoctorId = getByDoctorId;
