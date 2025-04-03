"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionsTable = exports.reportsTable = exports.patientsTable = exports.oldAgeHomesTable = exports.doctorsTable = exports.caretakersTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Caretakers Table
exports.caretakersTable = (0, pg_core_1.pgTable)("caretakers", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Doctors Table
exports.doctorsTable = (0, pg_core_1.pgTable)("doctors", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    specialization: (0, pg_core_1.varchar)("specialization", { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Old Age Homes Table
exports.oldAgeHomesTable = (0, pg_core_1.pgTable)("old_age_homes", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    phoneNumber: (0, pg_core_1.varchar)("phone_number", { length: 15 }).notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.varchar)("city", { length: 50 }).notNull(),
    state: (0, pg_core_1.varchar)("state", { length: 50 }).notNull(),
    pincode: (0, pg_core_1.varchar)("pincode", { length: 10 }).notNull(),
    currentOccupancy: (0, pg_core_1.integer)("current_occupancy").default(0),
    assignedcaretakerId: (0, pg_core_1.integer)("assigned_caretaker_id").references(() => exports.caretakersTable.id),
    assignedDoctorId: (0, pg_core_1.integer)("assigned_doctor_id").references(() => exports.doctorsTable.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Patients Table
exports.patientsTable = (0, pg_core_1.pgTable)("patients", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    age: (0, pg_core_1.integer)("age").notNull(),
    gender: (0, pg_core_1.varchar)("gender", { length: 10 }).notNull(),
    bloodGroup: (0, pg_core_1.varchar)("blood_group", { length: 5 }).notNull(),
    contact: (0, pg_core_1.varchar)("contact", { length: 15 }).notNull(),
    medicalHistory: (0, pg_core_1.text)("medical_history").array().notNull(),
    oldAgeHomeId: (0, pg_core_1.integer)("old_age_home_id")
        .references(() => exports.oldAgeHomesTable.id, { onDelete: "cascade" })
        .notNull(),
    assignedcaretakerId: (0, pg_core_1.integer)("assigned_caretaker_id").references(() => exports.caretakersTable.id),
    assignedDoctorId: (0, pg_core_1.integer)("assigned_doctor_id").references(() => exports.doctorsTable.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Health Reports Table (Caretakers submit reports)
exports.reportsTable = (0, pg_core_1.pgTable)("reports", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    symptoms: (0, pg_core_1.text)("symptoms").notNull(),
    detailedAnalysis: (0, pg_core_1.text)("detailed_analysis").notNull(),
    precautions: (0, pg_core_1.text)("precautions").array().notNull(), // Array of text
    typeOfDoctors: (0, pg_core_1.varchar)("type_of_doctors", { length: 255 }).notNull(),
    predictions: (0, pg_core_1.text)("predictions").array().notNull(), // Array of text
    patientId: (0, pg_core_1.integer)("patient_id")
        .references(() => exports.patientsTable.id, { onDelete: "cascade" })
        .notNull(),
    caretakerId: (0, pg_core_1.integer)("caretaker_id")
        .references(() => exports.caretakersTable.id, { onDelete: "cascade" })
        .notNull(),
    doctorId: (0, pg_core_1.integer)("doctor_id")
        .references(() => exports.doctorsTable.id, { onDelete: "cascade" })
        .notNull(),
    verified: (0, pg_core_1.boolean)("verified").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// Prescriptions Table (Doctors prescribe medicines)
exports.prescriptionsTable = (0, pg_core_1.pgTable)("prescriptions", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    patientId: (0, pg_core_1.integer)("patient_id")
        .references(() => exports.patientsTable.id, { onDelete: "cascade" })
        .notNull(),
    doctorId: (0, pg_core_1.integer)("doctor_id")
        .references(() => exports.doctorsTable.id, { onDelete: "cascade" })
        .notNull(),
    reportId: (0, pg_core_1.integer)("report_id")
        .references(() => exports.reportsTable.id, { onDelete: "cascade" })
        .notNull(),
    medicines: (0, pg_core_1.json)("medicines").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
