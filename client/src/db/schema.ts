import {
    integer,
    pgTable,
    varchar,
    boolean,
    json,
    serial,
    timestamp,
  } from "drizzle-orm/pg-core";
  
  // Caretakers Table
  export const caretakersTable = pgTable("caretakers", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
  
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Doctors Table
  export const doctorsTable = pgTable("doctors", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    specialization: varchar("specialization", { length: 255 }).notNull(),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Old Age Homes Table
  export const oldAgeHomesTable = pgTable("old_age_homes", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    caretakerId: integer("caretaker_id")
      .references(() => caretakersTable.id, { onDelete: "cascade" }),
    assignedDoctorId: integer("assigned_doctor_id")
      .references(() => doctorsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Patients Table
  export const patientsTable = pgTable("patients", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    oldAgeHomeId: integer("old_age_home_id")
      .references(() => oldAgeHomesTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // Health Reports Table (Caretakers submit reports)
  export const reportsTable = pgTable("reports", {
    id: serial("id").primaryKey(),
    patientId: integer("patient_id")
      .references(() => patientsTable.id, { onDelete: "cascade" })
      .notNull(),
    caretakerId: integer("caretaker_id")
      .references(() => caretakersTable.id, { onDelete: "cascade" })
      .notNull(),
    doctorId: integer("doctor_id")
      .references(() => doctorsTable.id, { onDelete: "cascade" })
      .notNull(),
    symptoms: varchar("symptoms", { length: 500 }).notNull(),
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
    medicines: json("medicines").notNull(), // Stores medicine name & dosage as JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  