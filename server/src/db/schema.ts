import {
  integer,
  pgTable,
  varchar,
  boolean,
  json,
  serial,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// Caretakers Table
export const caretakersTable = pgTable("caretakers", {
  id: serial("id").primaryKey(),
  username: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Doctors Table
export const doctorsTable = pgTable("doctors", {
  id: serial("id").primaryKey(),
  username: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Old Age Homes Table
export const oldAgeHomesTable = pgTable("old_age_homes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),

  address: text("address").notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  state: varchar("state", { length: 50 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),

  currentOccupancy: integer("current_occupancy").default(0),

  assignedcaretakerId: integer("assigned_caretaker_id").references(
    () => caretakersTable.id
  ),
  assignedDoctorId: integer("assigned_doctor_id").references(
    () => doctorsTable.id
  ),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Patients Table
export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  bloodGroup: varchar("blood_group", { length: 5 }).notNull(),
  contact: varchar("contact", { length: 15 }).notNull(),
  medicalHistory: text("medical_history").array().notNull(),
  oldAgeHomeId: integer("old_age_home_id")
    .references(() => oldAgeHomesTable.id, { onDelete: "cascade" })
    .notNull(),
  assignedcaretakerId: integer("assigned_caretaker_id").references(
    () => caretakersTable.id
  ),
  assignedDoctorId: integer("assigned_doctor_id").references(
    () => doctorsTable.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Health Reports Table (Caretakers submit reports)
export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  symptoms: text("symptoms").notNull(),
  detailedAnalysis: text("detailed_analysis").notNull(),
  precautions: text("precautions").array().notNull(), // Array of text
  typeOfDoctors: varchar("type_of_doctors", { length: 255 }).notNull(),
  predictions: text("predictions").array().notNull(), // Array of text
  patientId: integer("patient_id")
    .references(() => patientsTable.id, { onDelete: "cascade" })
    .notNull(),
  caretakerId: integer("caretaker_id")
    .references(() => caretakersTable.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => doctorsTable.id, { onDelete: "cascade" })
    .notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Prescriptions Table (Doctors prescribe medicines)
export const prescriptionsTable = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .references(() => patientsTable.id, { onDelete: "cascade" })
    .notNull(),
  doctorId: integer("doctor_id")
    .references(() => doctorsTable.id, { onDelete: "cascade" })
    .notNull(),
  reportId: integer("report_id")
    .references(() => reportsTable.id, { onDelete: "cascade" })
    .notNull(),
  medicines: json("medicines").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
