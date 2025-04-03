"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionSchema = exports.ReportSchema = exports.PatientSchema = exports.OldAgeHomeSchema = exports.SigninSchema = exports.SignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignupSchema = zod_1.default.object({
    username: zod_1.default
        .string({ required_error: "Username is required" })
        .min(3, { message: "Username must be at least 3 characters" }),
    email: zod_1.default
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address format" }),
    password: zod_1.default
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    }),
});
exports.SigninSchema = zod_1.default.object({
    email: zod_1.default
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address format" }),
    password: zod_1.default
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
    }),
});
exports.OldAgeHomeSchema = zod_1.default.object({
    name: zod_1.default
        .string({ required_error: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name cannot exceed 100 characters" }),
    phoneNumber: zod_1.default
        .string({ required_error: "Phone number is required" })
        .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number format" }),
    address: zod_1.default
        .string({ required_error: "Address is required" })
        .min(5, { message: "Address must be at least 5 characters" }),
    city: zod_1.default
        .string({ required_error: "City is required" })
        .min(2, { message: "City must be at least 2 characters" })
        .max(50, { message: "City cannot exceed 50 characters" }),
    state: zod_1.default
        .string({ required_error: "State is required" })
        .min(2, { message: "State must be at least 2 characters" })
        .max(50, { message: "State cannot exceed 50 characters" }),
    pincode: zod_1.default
        .string({ required_error: "Pincode is required" })
        .regex(/^[0-9]{6}$/, { message: "Pincode must be exactly 6 digits" }),
    currentOccupancy: zod_1.default
        .number({ required_error: "Current occupancy is required" })
        .int({ message: "Current occupancy must be an integer" })
        .nonnegative({ message: "Current occupancy cannot be negative" })
        .default(0),
    assignedCaretakerId: zod_1.default
        .number({ required_error: "Caretaker ID is required" })
        .int({ message: "Caretaker ID must be an integer" })
        .positive({ message: "Caretaker ID must be a positive number" }),
    assignedDoctorId: zod_1.default
        .number({ required_error: "Doctor ID is required" })
        .int({ message: "Doctor ID must be an integer" })
        .positive({ message: "Doctor ID must be a positive number" }),
});
exports.PatientSchema = zod_1.default.object({
    name: zod_1.default
        .string({ required_error: "Name is required" })
        .min(2, { message: "Name must be at least 2 characters" })
        .max(255, { message: "Name cannot exceed 255 characters" }),
    age: zod_1.default
        .number({ required_error: "Age is required" })
        .int({ message: "Age must be an integer" })
        .min(0, { message: "Age cannot be negative" })
        .max(150, { message: "Age must be realistic" }),
    gender: zod_1.default
        .string({ required_error: "Gender is required" })
        .min(1, { message: "Gender is required" })
        .max(10, { message: "Gender cannot exceed 10 characters" })
        .refine((val) => ["Male", "Female", "Other"].includes(val), {
        message: "Gender must be either Male, Female, or Other",
    }),
    bloodGroup: zod_1.default
        .string({ required_error: "Blood group is required" })
        .min(1, { message: "Blood group is required" })
        .max(5, { message: "Blood group cannot exceed 5 characters" })
        .refine((val) => /^(A|B|AB|O)[+-]$/.test(val), {
        message: "Invalid blood group format. Must be like A+, B-, etc.",
    }),
    contact: zod_1.default
        .string({ required_error: "Contact number is required" })
        .min(10, { message: "Contact number must be at least 10 digits" })
        .max(15, { message: "Contact number cannot exceed 15 characters" })
        .regex(/^\+?[0-9]{10,15}$/, {
        message: "Invalid contact number format. Must contain only numbers and optional + prefix",
    }),
    medicalHistory: zod_1.default
        .array(zod_1.default.string())
        .min(0, { message: "Medical history can be empty but must be an array" }),
    oldAgeHomeId: zod_1.default
        .number({ required_error: "Old age home ID is required" })
        .int({ message: "Old age home ID must be an integer" })
        .positive({ message: "Old age home ID must be positive" }),
    assignedcaretakerId: zod_1.default
        .number({ required_error: "Assigned caretaker ID is required" })
        .int({ message: "Assigned caretaker ID must be an integer" })
        .positive({ message: "Assigned caretaker ID must be positive" }),
    assignedDoctorId: zod_1.default
        .number({ required_error: "Assigned doctor ID is required" })
        .int({ message: "Assigned doctor ID must be an integer" })
        .positive({ message: "Assigned doctor ID must be positive" }),
});
exports.ReportSchema = zod_1.default.object({
    symptoms: zod_1.default.string().min(1, "Symptoms are required"),
    detailedAnalysis: zod_1.default.string().min(10, "Detailed analysis is required"),
    precautions: zod_1.default
        .array(zod_1.default.string())
        .min(1, "At least one precaution is required"),
    typeOfDoctors: zod_1.default.string().min(2, "Type of doctors is required"),
    predictions: zod_1.default
        .array(zod_1.default.string())
        .min(1, "At least one prediction is required"),
    patientId: zod_1.default.number().int().positive(),
    caretakerId: zod_1.default.number().int().positive(),
    doctorId: zod_1.default.number().int().positive(),
    verified: zod_1.default.boolean().default(false),
});
exports.PrescriptionSchema = zod_1.default.object({
    patientId: zod_1.default
        .number({ required_error: "Patient ID is required" })
        .int({ message: "Patient ID must be an integer" })
        .positive({ message: "Patient ID must be positive" }),
    doctorId: zod_1.default
        .number({ required_error: "Doctor ID is required" })
        .int({ message: "Doctor ID must be an integer" })
        .positive({ message: "Doctor ID must be positive" }),
    reportId: zod_1.default
        .number({ required_error: "Report ID is required" })
        .int({ message: "Report ID must be an integer" })
        .positive({ message: "Report ID must be positive" }),
    medicines: zod_1.default
        .array(zod_1.default.object({
        name: zod_1.default
            .string({ required_error: "Medicine name is required" })
            .min(2, { message: "Medicine name must be at least 2 characters" })
            .max(100, { message: "Medicine name cannot exceed 100 characters" }),
        dosage: zod_1.default
            .string({ required_error: "Dosage is required" })
            .min(2, { message: "Dosage must be at least 2 characters" })
            .max(50, { message: "Dosage cannot exceed 50 characters" }),
        frequency: zod_1.default
            .string({ required_error: "Frequency is required" })
            .min(2, { message: "Frequency must be at least 2 characters" })
            .max(50, { message: "Frequency cannot exceed 50 characters" }),
        duration: zod_1.default
            .string({ required_error: "Duration is required" })
            .min(2, { message: "Duration must be at least 2 characters" })
            .max(50, { message: "Duration cannot exceed 50 characters" }),
    }))
        .min(1, { message: "At least one medicine is required" })
        .max(20, { message: "Cannot exceed 20 medicines" }),
});
